import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import PaystackWebView from 'react-native-paystack-webview';

const PaymentScreen = () => {
  const [showPaystack, setShowPaystack] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {showPaystack ? (
        <PaystackWebView
          showPayButton={false}
          paystackKey="your-public-key-here"
          amount={5000} // Amount in the lowest denomination (e.g., 5000 for 50.00 NGN)
          billingEmail="customer@example.com"
          billingMobile="08123456789"
          billingName="John Doe"
          ActivityIndicatorColor="green"
          onSuccess={(response) => {
            setShowPaystack(false);
            alert(`Payment Successful! Reference: ${response.transactionRef}`);
          }}
          onCancel={() => {
            setShowPaystack(false);
            alert('Payment Canceled');
          }}
          autoStart={true} // Automatically open the Paystack payment modal
        />
      ) : (
        <Button title="Make Payment" onPress={() => setShowPaystack(true)} />
      )}
    </View>
  );
};

export default PaymentScreen;
