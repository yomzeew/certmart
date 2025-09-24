import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Paystack } from 'react-native-paystack-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { conversion, payreg } from '../../settings/endpoint';
import { PAYMENT_CONFIG, UI_CONFIG } from '../../settings/paymentConfig';
import {
  validatePaymentFields,
  getAuthToken,
  formatCurrency,
  createTimeoutPromise,
  handlePaymentError,
  PAYMENT_STATUS
} from '../../utils/paymentUtils';

const PaymentScreen = ({amount, currency, email, classtype, studentid, eventcode, close, setshowsuccess, courseInfo}) => {
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.IDLE);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [showRetryOption, setShowRetryOption] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  // Enhanced payment processing function
  const processPayment = async (transactionRef = null) => {
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);
    setLoadingMessage('Processing your payment...');
    setPaymentError('');

    try {
      // Validate required fields
      const requiredFields = {
        studentid,
        eventid: eventcode,
        amountpaid: amount,
        paymentref: transactionRef,
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

      // Use Promise.race to set a timeout for the network request
      const response = await Promise.race([
        axios.post(`${payreg}/${classtype.toLowerCase()}`, requiredFields, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        createTimeoutPromise(PAYMENT_CONFIG.NETWORK_TIMEOUT),
      ]);

      console.log("Payment registered successfully:", response?.data);
      setPaymentStatus(PAYMENT_STATUS.SUCCESS);
      setLoadingMessage('Payment successful!');

      // Close modal and show success after a brief delay
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

  const handlePaymentInitiation = async () => {
    if (amount === 0) {
      // Free course - process immediately
      await processPayment();
      return;
    }
    // Show payment summary first
    setShowPaymentSummary(true);
  };

  const handlePaymentConfirmation = async () => {
    setShowPaymentSummary(false);
    setPaymentStatus(PAYMENT_STATUS.PROCESSING);
    setLoadingMessage('Initializing payment gateway...');

    // Set a timeout for loading the payment page
    const timeout = setTimeout(() => {
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      setShowRetryOption(true);
      Alert.alert('Error', 'The payment page took too long to load. Please try again.');
    }, PAYMENT_CONFIG.PAYMENT_TIMEOUT);

    setLoadingTimeout(timeout);
    setPaymentStatus(PAYMENT_STATUS.IDLE);
  };

  const handleSuccess = async (transactionDetails) => {
    console.log("Transaction Successful:", transactionDetails);
    if (loadingTimeout) clearTimeout(loadingTimeout);
    setLoadingMessage('Verifying payment...');
    await processPayment(transactionDetails?.transactionRef?.reference);
  };

  const handleCancel = () => {
    console.log('Payment Canceled');
    setPaymentStatus(PAYMENT_STATUS.CANCELLED);
    if (loadingTimeout) clearTimeout(loadingTimeout);
    Alert.alert('Payment Cancelled', 'You can try again whenever you are ready.');
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setShowRetryOption(false);
    setPaymentError('');
    setPaymentStatus(PAYMENT_STATUS.IDLE);
    handlePaymentInitiation();
  };

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
                  <Text style={{ fontSize: 14 }}>Class Type: {courseInfo.classtype}</Text>
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
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Payment Methods</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>We accept various payment methods including cards, bank transfers, USSD, and mobile money.</Text>
              </View>
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
                  Proceed to Payment
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );

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

  // Cleanup timeout on unmount
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

      {paymentStatus === PAYMENT_STATUS.IDLE && (
        <Paystack
          paystackKey={PAYMENT_CONFIG.PAYSTACK_PUBLIC_KEY}
          amount={amount}
          billingEmail={email}
          currency={currency}
          activityIndicatorColor={UI_CONFIG.PRIMARY_COLOR}
          channels={PAYMENT_CONFIG.PAYMENT_CHANNELS}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          autoStart={false}
        />
      )}
    </View>
  );
};

export default PaymentScreen;
