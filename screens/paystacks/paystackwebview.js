import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Modal,StyleSheet } from 'react-native';
import { Paystack } from 'react-native-paystack-webview';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { payreg } from '../../settings/endpoint';
import { fetchCoupon,appliedCouponFn } from '../../utils/api';
import notificationService from '../../utils/notificationService';
import { PAYMENT_CONFIG, UI_CONFIG } from '../../settings/paymentConfig';
import {
  validatePaymentFields,
  getAuthToken,
  formatCurrency,
  createTimeoutPromise,
  handlePaymentError,
  PAYMENT_STATUS
} from '../../utils/paymentUtils';
import showToast from '../../utils/showToast';


const PaymentScreen = ({
  amount,
  currency,
  email,
  classtype,
  studentid,
  eventcode,
  close,
  setshowsuccess,
  courseInfo,
  couponCode
}) => {
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.IDLE);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false); // 👈 NEW
  const [paymentMethod, setPaymentMethod] = useState('paystack'); // 'paystack' | 'flutterwave'
  const [showFlutterwave, setShowFlutterwave] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [showRetryOption, setShowRetryOption] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [loadingTimeout, setLoadingTimeout] = useState(null);
 

  // ---------------- Process payment ----------------
  const processPayment = async (transactionRef = couponCode) => {
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);
    setLoadingMessage('Processing your payment...');
    setPaymentError('');
  
    try {
      const requiredFields = {
        studentid,
        eventid: eventcode,
        amountpaid: amount,
        paymentref: transactionRef || null,
        currency,
      };
  
      if (!validatePaymentFields(requiredFields)) {
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        return;
      }
  
      const token = await getAuthToken();
      if (!token) {
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        return;
      }
  
      // 🔹 1. Validate coupon FIRST if provided
      if (couponCode) {
        try {
          const couponResponse = await fetchCoupon(couponCode.trim());
          const usedStatus = couponResponse.data?.usage_status;
  
          if (usedStatus === 'Used') {
            setPaymentError('This coupon has already been used.');
            setPaymentStatus(PAYMENT_STATUS.FAILED);
            setShowRetryOption(true);
            showToast('error', 'Coupon Error', 'This coupon has already been used.');
            return; // ⛔ STOP — do not hit payreg endpoint
          }
        } catch (couponError) {
          setPaymentError(couponError.message || 'Failed to validate coupon');
          setPaymentStatus(PAYMENT_STATUS.FAILED);
          setShowRetryOption(true);
          showToast('error', 'Coupon Error', 'Failed to validate coupon');
          return; // ⛔ STOP
        }
      }
  
      // 🔹 2. If coupon is valid or not provided → proceed with payment
      const response = await Promise.race([
        axios.post(`${payreg}/${classtype.toLowerCase()}`, requiredFields, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        createTimeoutPromise(PAYMENT_CONFIG.NETWORK_TIMEOUT),
      ]);
  
      console.log("Payment registered successfully:", response?.data);
      setPaymentStatus(PAYMENT_STATUS.SUCCESS);
      setLoadingMessage('Payment successful!');
  
      // 🔹 3. Apply coupon AFTER successful payment
      if (couponCode) {
        try {
          const applied = await appliedCouponFn(couponCode);
          if (applied.error) {
            setPaymentError(applied.error);
            setPaymentStatus(PAYMENT_STATUS.FAILED);
            setShowRetryOption(true);
            showToast('error', 'Coupon Error', applied.error);
            return;
          } else {
            console.log("Coupon applied successfully:", applied);
          }
        } catch (applyError) {
          console.error("Error applying coupon:", applyError);
          // Do not fail payment if coupon application fails
        }
      }
  
      // 🔹 4. Schedule payment success notification
      try {
        const courseName = courseInfo?.course || courseInfo?.c_course || 'Course';
        const amountValue = Number(amount);
        await notificationService.schedulePaymentSuccessNotification(courseName, amountValue);
        console.log('Payment success notification scheduled');
      } catch (notificationError) {
        console.error('Error scheduling payment notification:', notificationError);
      }
  
      // 🔹 5. Close modal and show success after a brief delay
      setTimeout(() => {
        close(false);
        setshowsuccess(true);
      }, 1500);
  
    } catch (error) {
      const errorMessage = handlePaymentError(error);
      setPaymentError(errorMessage);
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      setShowRetryOption(true);
      Alert.alert("Payment Error", errorMessage);
    }
  };
  

  // ---------------- Handle initiation ----------------
  const handlePaymentInitiation = async () => {
    setShowPaymentSummary(true); // Show summary first
  };

  // ---------------- Confirm from summary ----------------
  const handlePaymentConfirmation = async () => {
    console.log('Payment confirmation initiated with amount:', amount);

    // Always close the payment summary first
    setShowPaymentSummary(false);

    // Handle free courses (amount <= 0)
    if (amount <= 0) {
      console.log('Processing free course...');
      setPaymentStatus(PAYMENT_STATUS.PROCESSING);
      setLoadingMessage('Processing your enrollment...');

      // Schedule course enrollment notification for free courses
      try {
        const courseName = courseInfo?.course || courseInfo?.c_course || 'Course';
        await notificationService.scheduleCourseEnrollmentNotification(courseName);
        console.log('Course enrollment notification scheduled');
      } catch (notificationError) {
        console.error('Error scheduling enrollment notification:', notificationError);
      }

      await processPayment();
      return;
    }

    // Handle paid courses - show selected gateway
    if (paymentMethod === 'paystack') {
      console.log('Opening Paystack for payment...');
      setShowPaystack(true);
      return;
    }
    console.log('Opening Flutterwave for payment...');
    setShowFlutterwave(true);
  };

  // ---------------- Paystack success ----------------
  const handleSuccess = async (transactionDetails) => {
    console.log("Transaction Successful:", transactionDetails);
    if (loadingTimeout) clearTimeout(loadingTimeout);
    setLoadingMessage('Verifying payment...');
    await processPayment(transactionDetails?.transactionRef?.reference);
    setShowPaystack(false); // 👈 Close Paystack
  };

  const handleCancel = () => {
    console.log('Payment Canceled');
    setPaymentStatus(PAYMENT_STATUS.CANCELLED);
    if (loadingTimeout) clearTimeout(loadingTimeout);
    setShowPaystack(false); // 👈 Close Paystack
    showToast('error','Payment Cancelled','You can try again whenever you are ready.');
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setShowRetryOption(false);
    setPaymentError('');
    setPaymentStatus(PAYMENT_STATUS.IDLE);
    handlePaymentInitiation();
  };


  // ---------------- Render Payment Summary ----------------
  const renderPaymentSummary = () => (
    <Modal animationType="slide" transparent={true} visible={showPaymentSummary}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: UI_CONFIG.BORDER_RADIUS, padding: 20, width: '90%', maxWidth: 400 }}>
            <TouchableOpacity
              onPress={() => setShowPaymentSummary(false)}
              style={{ position: 'absolute', right: 15, top: 15, zIndex: 10 }}
            >
              <MaterialIcons name="close" size={24} color={UI_CONFIG.PRIMARY_COLOR} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
              Payment Summary
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {courseInfo && (
                <View style={{ marginBottom: 20, padding: 15, backgroundColor: '#f8f9fa', borderRadius: UI_CONFIG.BORDER_RADIUS }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Course Details</Text>
                  <Text style={{ fontSize: 14, marginBottom: 5 }}>Course: {courseInfo.course || courseInfo.c_course}</Text>
                  <Text style={{ fontSize: 14, marginBottom: 5 }}>Duration: {courseInfo.duration} weeks</Text>
                  <Text style={{ fontSize: 14 }}>Class Type: {courseInfo.classType}</Text>
                </View>
              )}
              <View style={{ marginBottom: 20, padding: 15, backgroundColor: '#f8f9fa', borderRadius: UI_CONFIG.BORDER_RADIUS }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Payment Information</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 14 }}>Amount:</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600' }}>{formatCurrency(amount, currency)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 14 }}>Currency:</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600' }}>{currency}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 14 }}>Email:</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600' }}>{email}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14 }}>Student ID:</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600' }}>{studentid}</Text>
                </View>
              </View>
              {amount>0 &&
                <View style={{ marginBottom: 20, padding: 15, backgroundColor: '#f8f9fa', borderRadius: UI_CONFIG.BORDER_RADIUS }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Payment Method</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={() => setPaymentMethod('paystack')}
                    style={{
                      flex: 1,
                      marginRight: 6,
                      padding: 12,
                      borderWidth: paymentMethod === 'paystack' ? 2 : 1,
                      borderColor: paymentMethod === 'paystack' ? UI_CONFIG.PRIMARY_COLOR : '#ddd',
                      borderRadius: UI_CONFIG.BORDER_RADIUS,
                      alignItems: 'center',
                      backgroundColor: paymentMethod === 'paystack' ? '#eef2ff' : 'white'
                    }}
                  >
                    <Text style={{ fontWeight: '600' }}>Paystack</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPaymentMethod('flutterwave')}
                    style={{
                      flex: 1,
                      marginLeft: 6,
                      padding: 12,
                      borderWidth: paymentMethod === 'flutterwave' ? 2 : 1,
                      borderColor: paymentMethod === 'flutterwave' ? UI_CONFIG.PRIMARY_COLOR : '#ddd',
                      borderRadius: UI_CONFIG.BORDER_RADIUS,
                      alignItems: 'center',
                      backgroundColor: paymentMethod === 'flutterwave' ? '#eef2ff' : 'white'
                    }}
                  >
                    <Text style={{ fontWeight: '600' }}>Flutterwave</Text>
                  </TouchableOpacity>
                </View>
              </View>}
              <TouchableOpacity
                onPress={handlePaymentConfirmation}
                style={{
                  backgroundColor: UI_CONFIG.PRIMARY_COLOR,
                  padding: 15,
                  borderRadius: UI_CONFIG.BORDER_RADIUS,
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>

                  {amount>0?paymentMethod === 'paystack' ? 'Proceed to Paystack' : 'Proceed to Flutterwave':'Proceed to Enroll Now'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ---------------- Loading State ----------------
  const renderLoadingState = () => (
    <Modal animationType="fade" transparent={true} visible={paymentStatus === PAYMENT_STATUS.PROCESSING}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', borderRadius: UI_CONFIG.BORDER_RADIUS, padding: 30, alignItems: 'center', minWidth: 200 }}>
          <ActivityIndicator size="large" color={UI_CONFIG.PRIMARY_COLOR} />
          <Text style={{ marginTop: 15, fontSize: 16, textAlign: 'center', fontWeight: '500' }}>
            {loadingMessage}
          </Text>
        </View>
      </View>
    </Modal>
  );

  // ---------------- Retry Option ----------------
  const renderRetryOption = () => (
    showRetryOption && (
      <Modal animationType="slide" transparent={true} visible={showRetryOption}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', borderRadius: UI_CONFIG.BORDER_RADIUS, padding: 20, margin: 20, alignItems: 'center' }}>
            <MaterialIcons name="error-outline" size={48} color={UI_CONFIG.ERROR_COLOR} />
            <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 10 }}>
              Payment Failed
            </Text>
            <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#666' }}>
              {paymentError || 'Something went wrong with your payment. Please try again.'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowRetryOption(false)}
                style={{
                  backgroundColor: '#f5f5f5',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: UI_CONFIG.BORDER_RADIUS,
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRetry}
                style={{
                  backgroundColor: UI_CONFIG.PRIMARY_COLOR,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: UI_CONFIG.BORDER_RADIUS,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  Retry ({retryCount}/3)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  );

  //------- add Coupon-----

  

  // ---------------- Cleanup ----------------
  useEffect(() => {
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [loadingTimeout]);

  return (
    <View>
      {renderPaymentSummary()}
      {renderLoadingState()}
      {renderRetryOption()}

      {paymentStatus === PAYMENT_STATUS.SUCCESS ? (
        <View style={{ alignItems: 'center', padding: 20 }}>
          <MaterialIcons name="check-circle" size={48} color={UI_CONFIG.SUCCESS_COLOR} />
          <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 10, color: UI_CONFIG.SUCCESS_COLOR }}>
            Payment Successful!
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handlePaymentInitiation}
          disabled={paymentStatus === PAYMENT_STATUS.PROCESSING}
          style={{
            backgroundColor: paymentStatus === PAYMENT_STATUS.PROCESSING ? '#ccc' : UI_CONFIG.PRIMARY_COLOR,
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: UI_CONFIG.BORDER_RADIUS,
            alignItems: 'center',
            opacity: paymentStatus === PAYMENT_STATUS.PROCESSING ? 0.6 : 1,
          }}
        >
          {paymentStatus === PAYMENT_STATUS.PROCESSING ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              {amount === 0 ? 'Enroll Now' : `Pay ${formatCurrency(amount, currency)}`}
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* 👇 Paystack only renders when Proceed is clicked */}
      {showPaystack && (
        <Modal transparent animationType="slide" visible={showPaystack}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', borderRadius: UI_CONFIG.BORDER_RADIUS, padding: 20, width: '90%', maxWidth: 420 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>Paystack Payment</Text>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ textAlign: 'center', marginBottom: 8 }}>
                  Pay {formatCurrency(amount, currency)} with Paystack
                </Text>
                <Paystack
                  paystackKey={PAYMENT_CONFIG.PAYSTACK_PUBLIC_KEY}
                  amount={amount}
                  billingEmail={email}
                  currency={currency}
                  activityIndicatorColor={UI_CONFIG.PRIMARY_COLOR}
                  channels={PAYMENT_CONFIG.PAYMENT_CHANNELS}
                  onCancel={() => { setShowPaystack(false); handleCancel(); }}
                  onSuccess={handleSuccess}
                  autoStart={true}
                  refNumber={`PaystackMobile_${Date.now()}`}
                />
              </View>
              <TouchableOpacity
                onPress={() => { setShowPaystack(false); handleCancel(); }}
                style={{ backgroundColor: '#f3f4f6', padding: 10, borderRadius: UI_CONFIG.BORDER_RADIUS, alignItems: 'center' }}
              >
                <Text style={{ color: '#111827', fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {showFlutterwave && (
        <Modal transparent animationType="slide" visible={showFlutterwave}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', borderRadius: UI_CONFIG.BORDER_RADIUS, padding: 20, width: '90%', maxWidth: 420 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>Flutterwave Payment</Text>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ textAlign: 'center', marginBottom: 8 }}>
                  Pay {formatCurrency(amount, currency)} with Flutterwave
                </Text>
                <PayWithFlutterwave
                  options={{
                    tx_ref: `${'FlutterMobile'}+${studentid || 'tx'}_${Date.now()}`,
                    authorization: PAYMENT_CONFIG.FLUTTERWAVE_PUBLIC_KEY,
                    amount: Number(amount),
                    currency,
                    payment_options: 'card,banktransfer,ussd',
                    customer: {
                      email,
                      phonenumber: '',
                      name: courseInfo?.course || courseInfo?.c_course || 'Course Payment',
                    },
                    customizations: {
                      title: 'Certmart Payment',
                      description: 'Course payment',
                      logo: 'https://certmart.org/favicon.ico',
                    },
                  }}
                  onRedirect={async (data) => {
                    console.log(data)
                    // data.status: 'successful' | 'cancelled'
                    if (data?.status === 'completed' || data?.status==='successful') {
                      if (loadingTimeout) clearTimeout(loadingTimeout);
                      setLoadingMessage('Verifying payment...');
                      setShowFlutterwave(false);
                      await processPayment(data?.tx_ref || data?.transaction_id);
                    } else {
                      if (loadingTimeout) clearTimeout(loadingTimeout);
                      setLoadingMessage('Payment failed');
                      setShowFlutterwave(false);
                      handleCancel();
                    }
                  }}
                   customButton={(props) => (
    <TouchableOpacity
      style={styles.paymentButton}
      onPress={props.onPress}
      isBusy={props.isInitializing}
      disabled={props.disabled}>
        <Text style={styles.paymentButtonText}>Pay {formatCurrency(amount, currency)}</Text>
    </TouchableOpacity>
  )}
                
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowFlutterwave(false)}
                style={{ backgroundColor: '#f3f4f6', padding: 10, borderRadius: UI_CONFIG.BORDER_RADIUS, alignItems: 'center' }}
              >
                <Text style={{ color: '#111827', fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  paymentButton: {
    backgroundColor: UI_CONFIG.PRIMARY_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: UI_CONFIG.BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
