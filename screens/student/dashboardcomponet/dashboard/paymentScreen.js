import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator } from "react-native";
import { Avatar, TextInput } from "react-native-paper";
import { useState, useEffect } from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { colorred } from "../../../../constant/color";
import PaymentScreen from "../../../paystacks/paystackwebview";
import { convertCurrency, fetchStudentProfile, appliedCouponFn, fetchCoupon } from "../../../../utils/api";
import { UI_CONFIG } from '../../../../settings/paymentConfig';
import CustomTextInput from "../../../../components/CustomTextInput";
import showToast from "../../../../utils/showToast";

const PaymentScreenModal = ({ selected, setshowpayment, setShowLoader, setshowsuccess }) => {
  const [Email, setEmail] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [amount, setAmount] = useState(Number(selected?.price || 0));
  const initialamount = Number(selected?.price || 0);
  const [studentid, setStudentId] = useState("");
  const [showcurrency, setShowCurrency] = useState(false);

  // coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [showcoupon, setShowCoupon] = useState(false);

  const currencydata = [
    { country: "Nigeria", code: "NGN" },
    { country: "United States", code: "USD" },
    { country: "Ghana", code: "GHS" },
    { country: "Kenya", code: "KES" },
    { country: "South Africa", code: "ZAR" },
  ];

  const fetchdata = async () => {
    try {
      const studentDetails = await fetchStudentProfile();
      setEmail(studentDetails.email || "");
      setStudentId(studentDetails.studentid || "");
    } catch (error) {
      console.error("Error fetching student details:", error.message);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const handleCurrency = async (object) => {
    setShowLoader(true);
    const currencyCode = object.code;
    try {
      const convertedAmount = await convertCurrency(selected.taval_cost, currencyCode);
      setAmount(convertedAmount);
      setCurrency(currencyCode);
      setShowCurrency(false);
    } catch (error) {
      console.error("Error converting currency:", error.message);
    } finally {
      setShowLoader(false);
    }
  };

  const applyCouponCode = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setCouponLoading(true);
    setCouponError('');


         


   
    try {
       
      const response = await fetchCoupon(couponCode.trim());
      console.log(response,'coupon response');
      console.log(response.data?.percentage_offer,'coupon response');
      

      if (response) {
        const percent = Number(response.data?.percentage_offer); // percentage discount
        console.log(percent,'percent')
        const calcDiscount = (initialamount * percent); // ✅ correct calculation

        setAppliedCoupon({code: couponCode.trim(), percent });
        setAmount(calcDiscount);
        setDiscountAmount(initialamount-calcDiscount)
        setCouponError('');
        //showToast('success','Coupon applied!',`You saved ${currency} ${amount-calcDiscount.toFixed(2)}`);
        Alert.alert('Success', `Coupon applied! You saved ${currency} ${amount-calcDiscount.toFixed(2)}`);
        setShowCoupon(false);
      } else {
        showToast('error','Coupon Error','Invalid coupon code');
        setCouponError('Invalid coupon code');
      }
    } catch (error) {
      console.error('Coupon error:', error);

      // Extract the specific error message from the API response
      let errorMessage = 'Failed to apply coupon. Please try again.';

      if (error.message) {
        // Use the specific error message from the API
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        // Handle server response error messages
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        // Handle server response error
        errorMessage = error.response.data.error;
      }
      setCouponError(errorMessage);
      showToast('error','Coupon Error',errorMessage);
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponError('');
  };

  const renderAddCoupon = () => (
    <Modal animationType="slide" transparent={true} visible={showcoupon}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', borderRadius: UI_CONFIG.BORDER_RADIUS, padding: 30, alignItems: 'center', width: '90%', maxWidth: 400 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15 }}>Add Coupon</Text>

          <CustomTextInput
            label="Coupon Code"
            value={couponCode}
            onChangeText={setCouponCode}
            error={!!couponError}
            style={{ width: '100%', marginBottom: 10 }}
          />

          {couponError ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{couponError}</Text> : null}

          <TouchableOpacity
            onPress={applyCouponCode}
            disabled={couponLoading}
            style={{
              backgroundColor: couponLoading ? '#ccc' : UI_CONFIG.PRIMARY_COLOR,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: UI_CONFIG.BORDER_RADIUS,
              width: '100%',
              alignItems: 'center',
              marginBottom: 10
            }}
          >
            {couponLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={{ color: 'white', fontWeight: '600' }}>Apply Coupon</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowCoupon(false)}
            style={{
              backgroundColor: '#f5f5f5',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: UI_CONFIG.BORDER_RADIUS,
              width: '100%',
              alignItems: 'center'
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const finalAmount = amount;

  return (
    <>
      {renderAddCoupon()}
      <View style={{ zIndex: 40, elevation: 40 }} className="bg-red-300 opacity-70 h-full w-full absolute z-40" />
      <View style={{ zIndex: 50, elevation: 50 }} className="absolute w-full justify-center h-full items-center">
        <View className="w-5/6 justify-center bg-white rounded-2xl h-auto border border-red-300 p-3">
          <TouchableOpacity
            style={{ zIndex: 50, elevation: 50 }}
            onPress={() => setshowpayment(false)}
            className="absolute right-2 top-0"
          >
            <FontAwesome5 color={colorred} size={24} name="times" />
          </TouchableOpacity>

          <View className="items-center mt-10">
            <Text>You are Paying for {selected.duration} weeks Course on</Text>
            <Text className="text-lg text-center font-bold">{selected?.course || selected?.c_course}</Text>
          </View>

          <View className="items-center">
            {selected.dp ? (
              <Avatar.Image source={{ uri: `https://certmart.org/dps/${selected.dp}.jpg?timestamp=${new Date().getTime()}` }} />
            ) : (
              <Avatar.Image source={require("../../../images/avatermale.png")} />
            )}
            <View className="ml-2 flex-row">
              <Text className="mr-1">{selected?.avg_rating || ""}</Text>
              <FontAwesome name="star" size={14} color="orange" />
            </View>
            <View>{selected.classtype}</View>
          </View>

          <View className="mt-3 items-center">
            <Text style={{ fontSize: 16 }}>Change your Currency</Text>
            <TouchableOpacity
              onPress={() => setShowCurrency(!showcurrency)}
              className="bg-red-200 h-10 rounded-2xl w-full items-center justify-center"
            >
              <Text>{currency || "Choose your Currency"}</Text>
            </TouchableOpacity>

            {showcurrency && (
              <View className="bg-red-200 h-40 rounded-2xl w-full items-center justify-center py-3 px-3 mt-3">
                <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                  {currencydata.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleCurrency(item)}
                      className="bg-red-300 mt-2 w-full items-center justify-center rounded-full h-8"
                    >
                      <Text className="text-sm">
                        {item.code} - <Text className="text-xs">{item.country}</Text>
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text className="text-lg mt-2">Amount Due for Payment:</Text>
            {appliedCoupon ? (
              <View style={{ width: '100%', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text className="text-sm">Original Amount:</Text>
                  <Text className="text-sm">{currency} {initialamount.toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text className="text-sm text-green-600">Discount ({appliedCoupon.percent}%):</Text>
                  <Text className="text-sm text-green-600">-{currency} {discountAmount.toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 5 }}>
                  <Text className="text-lg font-bold">Final Amount:</Text>
                  <Text className="text-lg font-bold">{currency} {finalAmount.toFixed(2)}</Text>
                </View>
              </View>
            ) : (
              <Text className="text-lg">{currency} {amount.toFixed(2)}</Text>
            )}
          </View>

          <View className="my-3 items-center">
            {appliedCoupon ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={removeCoupon}
                  style={{
                    backgroundColor: '#28a745',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    marginBottom: 10,
                    width: '80%'
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    ✓ {appliedCoupon.code} Applied (-{currency} {discountAmount.toFixed(2)})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowCoupon(true)}
                  style={{
                    backgroundColor: '#6c757d',
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                    borderRadius: 12,
                    width: '80%'
                  }}
                >
                  <Text className="text-white text-center">Change Coupon</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowCoupon(true)}
                style={{
                  backgroundColor: colorred,
                  paddingVertical: 12,
                  paddingHorizontal: 25,
                  borderRadius: 12,
                  width: '80%'
                }}
              >
                <Text className="text-white text-center font-semibold">Use Coupon Code</Text>
              </TouchableOpacity>
            )}
          </View>

          <PaymentScreen
            email={Email}
            currency={currency}
            amount={finalAmount.toFixed(2)}
            classtype={selected.classType}
            eventcode={selected.eventcode}
            studentid={studentid}
            close={setshowpayment}
            setshowsuccess={setshowsuccess}
            courseInfo={selected}
            couponCode={couponCode}
          />
        </View>
      </View>
    </>
  );
};

export default PaymentScreenModal;
