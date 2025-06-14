import axios from 'axios';
import React, { useState } from 'react';
import { View, Button, Text,TouchableOpacity,Alert } from 'react-native';
import  { Paystack }  from 'react-native-paystack-webview';
import { conversion, payreg } from '../../settings/endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = ({amount,currency,email,classtype,studentid,eventcode,close,setshowsuccess }) => {
const [showPaystack, setShowPaystack] = useState(false);
console.log(amount,email,currency,classtype)
const [loadingTimeout, setLoadingTimeout] = useState(null);

  const timeoutDuration = 360000; // 360 seconds

  const handlepayment = () => {
    setShowPaystack(true);

    // Set a timeout for loading the payment page
    const timeout = setTimeout(() => {
      setShowPaystack(false);
      Alert.alert('Error', 'The payment page took too long to load. Please try again.');
    }, timeoutDuration);

    setLoadingTimeout(timeout);
  };

const handleSuccess = async (transactionDetails) => {
  console.log('Transaction Successful:', transactionDetails);
  console.log(eventcode);
  if (loadingTimeout) clearTimeout(loadingTimeout);
  setShowPaystack(false);


  try {
      const data = {
          studentid,
          eventid: eventcode,
          amountpaid: amount,
          paymentref: transactionDetails.transactionRef.reference,
          currency:currency,
      };

      const token = await AsyncStorage.getItem("token");

      // Use Promise.race to set a timeout for the network request
      const response = await Promise.race([
          axios.post(`${payreg}/${classtype.toLowerCase()}`, data, {
              headers: { Authorization: `Bearer ${token}` },
          }),
          new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request Timeout')), 10000)
          ),
      ]);
      console.log('Payment registered successfully:', response.data);
      close(false)
      setshowsuccess(true)
  } catch (error) {
      if (error.message === 'Request Timeout') {
          console.error('Error: The request timed out.');
          Alert.alert('Error', 'The request timed out. Please try again.');
      } else {
          console.error('Error registering payment:', error.response?.data || error.message);
          Alert.alert('Error', 'Failed to register payment. Please contact support.');
      }
  }
};
const handleCancel = () => {
  console.log('Payment Canceled');
  setShowPaystack(false);

  // Clear any existing timeout
  if (loadingTimeout) clearTimeout(loadingTimeout);
};

  return (

    <View>
      {showPaystack ? (
       <Paystack  
       paystackKey="pk_live_100d4761c8c122fe96c5e9d78e69265add54306b"
       amount={amount}
       billingEmail={email}
       currency={currency}
       activityIndicatorColor="green"
       channels={["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer", "eft", "apple_pay"]}
       onCancel={(e) => {
        handleCancel()
       }}
       onSuccess={(res) => {
        handleSuccess(res)
         // handle response here
       }}
       autoStart={true}
     />
      ) : (
        <TouchableOpacity onPress={handlepayment} className="w-full h-10 rounded-2xl bg-red-500 mt-2 items-center justify-center">
                        <Text className="text-white">
                           Proceed
                        </Text>
              </TouchableOpacity>
      )}
    </View>
  );
};

export default PaymentScreen;
