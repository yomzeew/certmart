
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, View, Text, Linking, ScrollView, TouchableOpacity, Modal, Dimensions,Vibration,TextInput, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Avatar, Divider } from "react-native-paper";
import { colorred } from "../../../constant/color";
import { useState, useEffect } from "react";
import { endClassFn, reviewFn,ratingFn, classesStatusFn, examEnrollFn } from "../../../utils/api";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";
import showToast from "../../../utils/showToast";
import { styles } from "../../../settings/layoutsetting";

const ClassesDetails = () => {
     const { height } = Dimensions.get("window");
    
     const route = useRoute();
        const navigation = useNavigation();
        const { item } = route.params;
        console.log(item,'item trainerDp')
        const [selectedItem, setSelectedItem] = useState(null);
        const [modalVisible, setModalVisible] = useState(false);
        const [showEndClassModal, setShowEndClassModal] = useState(false);
        const [showRatingModal, setShowRatingModal] = useState(false);
        const [showReviewModal, setShowReviewModal] = useState(false);
        const [experience, setExperience]=useState("")
        const [rating,setRating]=useState(1)
        const [getStatus,setGetStatus]=useState("")

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${item.trainerEmail}`);
    };

    const handlePhonePress = () => {
        Linking.openURL(`tel:${item.trainerPhone}`);
    };


    const startDate = moment(item.startdate.split(" ")[0], "YYYY-MM-DD");
    const today = moment();
    const totalWeeks = item.duration;
    const totalDays = totalWeeks * 7; // Convert weeks to days
    const daysUsed = today.diff(startDate, "days");
    const percentageUsed = Math.min((daysUsed / totalDays) * 100, 100);

    // get status 

    const getStatusFn = async () => {
        try {
            const response = await classesStatusFn(item?.registrationid);
            if (response && !response.error) {
                console.log(response,'check')
                const status=response?.data?.status
                setGetStatus(status)
            } else {
                setGetStatus("")
                return 
            }
        } catch (error) {
            console.log("Error getting status:", error);
            return "Unknown";
        }
    };

    useEffect(() => {
        getStatusFn();
    }, [item]);

    const enrollFn=async()=>{
        try {
            const response = await examEnrollFn(item?.registrationid);
            if (response && !response.error) {
                await getStatusFn()
                showToast("success","Successful","Class enrolled successfully")
                //navigation.goBack(); // Go back to classes list after enrollment
               
            } else {
                showToast("error","Failed",response?.error)
                console.error("Failed to enroll in class:", response?.error);
            }
        } catch (error) {
            console.log("Error enrolling in class:", error);
        }
    }

    const handleEndClass = (item) => {
        setSelectedItem(item);
        setShowEndClassModal(true);
        Vibration.vibrate(200); // ✅ vibrates for 200ms
    };



    const confirmEndClass = async () => {
        console.log(item.endclassstudent)
        if(item.endclassstudent==1){
            showToast("error","You have already marked this class as ended")
            return
        }
        try {
            const response = await endClassFn(item?.registrationid);
            if (response && !response.error) {
                showToast("success","Successful","Class ended successfully")
                setShowRatingModal(true); // show rating modal if needed
            } else {
                showToast("error","Failed",response?.error)
                console.error("Failed to end class:", response?.error);
            }
        } catch (error) {
            console.log("Error ending class:", error);
        } finally {
            setShowEndClassModal(false);
        }
    };

    const cancelEndClass = () => {
        setShowEndClassModal(false);
    };
    const handlegoback = () => {
        navigation.goBack();
    };
    const handlerate=(star)=>{
        setRating(star)

    }
    const handleRating = async () => {
           const data = {
               appraisee: "Virtual",
               appraisal: rating, // rating from 1-5
               class_id: item?.registrationid,
           };
           try {
               const response = await ratingFn(data);
               if (response  && !response.error) {
                   setShowRatingModal(false);
                   showToast("success","Successful","Rating submitted successfully")
                   setShowReviewModal(true); // Show review modal after rating
                } else {
                    showToast("error","Failed",response?.error)
                    console.error("Failed to end class:", response?.error);
                }
           } catch (error) {
               console.log(error);
           }
       };
   
       const handlefeedback = async () => {
           const data = {
               experience: experience,
               class_id: item?.registrationid,
           };
           try {
               const response = await reviewFn(data);
               if (response && !response.error ) {
                   setShowReviewModal(false);
                   showToast("success","Successful","Review submitted successfully")
                   navigation.goBack(); // Go back to classes list after review

                } else {
                    showToast("error","Failed",response?.error)
                    console.error("Failed to review", response?.error);
                }
           } catch (error) {
               console.log(error);
           }
       };
   
       const renderConfirmModal = () => (
           <Modal animationType="slide" transparent={true} visible={showEndClassModal}>
               <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
                   <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center', width: '90%', maxWidth: 400 }}>
                       <View style={{ alignItems: 'center', marginBottom: 20 }}>
                           <View style={{ width: 64, height: 64, backgroundColor: '#FEF3C7', borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                               <Text style={{ fontSize: 24 }}>⚠️</Text>
                           </View>
                           <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 8 }}>
                               End This Class?
                           </Text>
                           <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 }}>
                               Are you sure you want to end this class? This action cannot be undone and will mark the class as completed.
                           </Text>
                       </View>
   
                       <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                           <TouchableOpacity
                               onPress={cancelEndClass}
                               style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
                           >
                               <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>Cancel</Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                               onPress={confirmEndClass}
                               style={{ flex: 1, backgroundColor: '#F97316', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
                           >
                               <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>End Class</Text>
                           </TouchableOpacity>
                       </View>
                   </View>
               </View>
           </Modal>
       );
   
       const renderRatingModal = () => (
           <Modal animationType="slide" transparent={true} visible={showRatingModal}>
               <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
                   <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center', width: '90%', maxWidth: 400 }}>
                       <View style={{ alignItems: 'center', marginBottom: 20 }}>
                           <View style={{ width: 64, height: 64, backgroundColor: '#DBEAFE', borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                               <Text style={{ fontSize: 24 }}>⭐</Text>
                           </View>
                           <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 8 }}>
                               Rate Your Trainer
                           </Text>
                           <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 }}>
                               How would you rate your trainer's performance?
                           </Text>
                       </View>
   
                       {/* Star Rating */}
                       <View style={{ flexDirection: 'row', marginBottom: 24, justifyContent: 'center', alignItems: 'center' }}>
                           <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginRight: 16 }}>
                               {rating}/5
                           </Text>
                           <View style={{ flexDirection: 'row' }}>
                               {[1, 2, 3, 4, 5].map((star) => (
                                   <TouchableOpacity
                                       key={star}
                                       onPress={() => handlerate(star)}
                                       style={{
                                           padding: 2,
                                           marginHorizontal: 2,
                                           borderRadius: 8,
                                           backgroundColor: star <= rating ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
                                       }}
                                       activeOpacity={0.7}
                                   >
                                       <Text
                                           style={{
                                               fontSize: 36,
                                               color: star <= rating ? '#F59E0B' : '#D1D5DB',
                                               textShadowColor: star <= rating ? 'rgba(245, 158, 11, 0.3)' : 'transparent',
                                               textShadowOffset: { width: 0, height: 0 },
                                               textShadowRadius: star <= rating ? 4 : 0
                                           }}
                                       >
                                           {star <= rating ? '★' : '☆'}
                                       </Text>
                                   </TouchableOpacity>
                               ))}
                           </View>
                       </View>
   
                       <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
                          
                           <TouchableOpacity
                               onPress={() => handleRating(rating)}
                               className="bg-red-500"
                               style={{ flex: 1,  paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
                           >
                               <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>Submit Rating</Text>
                           </TouchableOpacity>
                       </View>
                   </View>
               </View>
           </Modal>
       );
   
       const renderReviewModal = () => (
           <Modal animationType="slide" transparent={true} visible={showReviewModal}>
               <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
                   <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center', width: '90%', maxWidth: 400 }}>
                       <View style={{ alignItems: 'center', marginBottom: 20 }}>
                           <View style={{ width: 64, height: 64, backgroundColor: '#D1FAE5', borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                               <Text style={{ fontSize: 24 }}>💬</Text>
                           </View>
                           <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 8 }}>
                               Share Your Experience
                           </Text>
                           <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 }}>
                               Tell us about your learning experience
                           </Text>
                       </View>
   
                       {/* Review Input */}
                       <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                           <View style={{ width: '100%', marginBottom: 24 }}>
                               <TextInput
                                   style={{
                                       borderWidth: 1,
                                       borderColor: '#D1D5DB',
                                       borderRadius: 12,
                                       padding: 16,
                                       minHeight: 100,
                                       textAlignVertical: 'top',
                                       fontSize: 16,
                                       color: '#1F2937'
                                   }}
                                   placeholder="Share your experience..."
                                   placeholderTextColor="#9CA3AF"
                                   value={experience}
                                   onChangeText={setExperience}
                                   multiline={true}
                                   returnKeyType="default"
                                   blurOnSubmit={true}
                                   onSubmitEditing={Keyboard.dismiss}
                               />
                           </View>
                       </TouchableWithoutFeedback>
   
                       <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
                           <TouchableOpacity
                               onPress={() => setShowReviewModal(false)}
                               style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
                           >
                               <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>Skip</Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                               onPress={handlefeedback}
                               style={{ flex: 1, backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
                           >
                               <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>Submit Review</Text>
                           </TouchableOpacity>
                       </View>
                   </View>
               </View>
           </Modal>
       );
    return (
        <>
        {renderConfirmModal()}
        {renderRatingModal()}
        {renderReviewModal()}
        <SafeAreaView style={[styles.andriod,styles.bgcolor, { flex: 1, width: '100%'}]}>
          <View className="w-full pt-[20px] ">
                    <View className=" w-full flex-row gap-x-2 items-center">
                        <TouchableOpacity
                            onPress={handlegoback}
                            className={`p-3 rounded-2xl item-center`}
                        >
                            <FontAwesome name="arrow-left" size={12} color={colorred} />
                            
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: '600',color:colorred }}>Class Details</Text>
                    </View>
                     <Divider style={{marginVertical:10,backgroundColor:colorred}}/>
                    </View>
                        <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 160 }} style={{ flex: 1, paddingHorizontal: 12 }} showsVerticalScrollIndicator={false}>
        <View style={{
            backgroundColor: 'white',
            borderRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            borderWidth: 1,
            padding:16,
            borderColor: '#F3F4F6'
        }}>
            {/* Header Section with Trainer Info */}
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                {item.trainerDp &&(
                    <Avatar.Image
                        source={{
                            uri: `https://certmart.org/dps/${item.trainerDp}.jpg?timestamp=${new Date().getTime()}`,
                        }}
                        size={80}
                        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                    />
                )}
                <View style={{ alignItems: 'center', marginTop: 12 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
                        {item.trainerSurname} {item.trainerFirstname}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
                        Trainer ID: {item.trainerId}
                    </Text>

                    {/* Contact Buttons */}
                    <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#EF4444',
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                                alignItems: 'center',
                                shadowColor: '#EF4444',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2,
                                borderWidth: 1,
                                borderColor: '#DC2626'
                            }}
                            onPress={handleEmailPress}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>📧 Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#10B981',
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                                alignItems: 'center',
                                shadowColor: '#10B981',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2
                            }}
                            onPress={handlePhonePress}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>📞 Call</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Course Progress Section */}
            <View style={{ marginTop: 20, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>Course Progress</Text>

                {/* Date Range */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Start:</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginLeft: 8 }}>{startDate.format("MMM DD, YYYY")}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>End:</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginLeft: 8 }}>{startDate.add(totalDays, "days").format("MMM DD, YYYY")}</Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={{ marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Progress</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1F2937' }}>{Math.round(percentageUsed)}% Complete</Text>
                    </View>
                    <View style={{ width: '100%', height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1 }}>
                        <View
                            style={{
                                width: `${percentageUsed}%`,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: percentageUsed >= 100 ? '#10B981' :  // Full green at 100%
                                               percentageUsed >= 70 ? '#F59E0B' :   // Orange at 70%+
                                               percentageUsed >= 50 ? '#3B82F6' :   // Blue at 50%+
                                               percentageUsed >= 30 ? '#8B5CF6' :   // Purple at 30%+
                                               '#EF4444'                            // Red below 30%
                            }}
                        />
                    </View>
                    <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, textAlign: 'center' }}>{daysUsed} days elapsed</Text>
                </View>
            </View>

            {/* Duration Info */}
            <View style={{ marginTop: 16, padding: 12, backgroundColor: '#FEF2F2', borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#DC2626' }}>⏰ Course Duration</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#991B1B', marginLeft: 8 }}>{item.duration} weeks</Text>
                </View>
            </View>

            <DayBooks day={item.days} />
            {getStatus==="ongoing" &&
            <TouchableOpacity
                onPress={() => handleEndClass(item.eventId)}
                style={{
                    marginTop: 16,
                    backgroundColor:`${item.endclassstudent===1 ? 'rgba(249, 115, 22, 0.5)' : '#F97316'}`,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                    shadowColor: '#F97316',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4
                }}
                disabled={item.endclassstudent===1}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{item.endclassstudent===1 ? 'Class Ended' : 'End Class'}</Text>
            </TouchableOpacity>}
            {getStatus === 'ended' && 
            <>
             <TouchableOpacity
             onPress={() => enrollFn()}
             style={{
                 marginTop: 16,
                 backgroundColor: '#F97316',
                 paddingVertical: 12,
                 borderRadius: 12,
                 alignItems: 'center',
                 shadowColor: '#F97316',
                 shadowOffset: { width: 0, height: 2 },
                 shadowOpacity: 0.2,
                 shadowRadius: 4
             }}
         >
             <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Enroll for an Exam</Text>
         </TouchableOpacity>
             <TouchableOpacity
             onPress={() => setShowRatingModal(true)}
             style={{
                 marginTop: 16,
                 backgroundColor: '#ffffff',
                 paddingVertical: 12,
                 borderRadius: 12,
                 alignItems: 'center',
                 shadowColor: '#F97316',
                 shadowOffset: { width: 0, height: 2 },
                 shadowOpacity: 0.2,
                 shadowRadius: 4
             }}
         >
             <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'orange' }}>Give Rating and Feedback </Text>
         </TouchableOpacity>
         </>
         

}
        </View>

       
        </ScrollView>
        </View>
        </SafeAreaView>
        </>
    );
};
const DayBooks = ({ day }) => {
    const daysArray = day
        .trim()
        .split(/\s+/)
        .filter((day) => day);

    const dayMapping = {
        Sunday: "Sun",
        Monday: "Mon",
        Tuesday: "Tues",
        Wednesday: "Wed",
        Thursday: "Thur",
        Friday: "Fri",
        Saturday: "Sat",
    };

    const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    const bookedDaysShort = daysArray.map((fullDay) => dayMapping[fullDay]);

    const today = new Date();
    const weekDates = days.map((_, index) => {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + index);
        return {
            day: date.getDate().toString().padStart(2, "0"),
            month: (date.getMonth() + 1).toString().padStart(2, "0"),
            isToday: date.toDateString() === today.toDateString()
        };
    });

    return (
        <View style={{
            marginTop: 20,
            padding: 16,
            backgroundColor: '#ECFDF5',
            borderRadius: 16,
            shadowColor: '#10B981',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2
        }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#065F46', marginBottom: 16, textAlign: 'center' }}>📅 Training Schedule</Text>
            <Text style={{ fontSize: 14, color: '#065F46', textAlign: 'center', marginBottom: 16 }}>
                Your booked training days for this week
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    style={{ width: '100%' }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        {days.map((dayName, index) => {
                            const isBooked = bookedDaysShort.includes(dayName);
                            const dateInfo = weekDates[index];

                            return (
                                <View key={index} style={{ alignItems: 'center', marginHorizontal: 4 }}>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: '500',
                                        marginBottom: 4,
                                        color: dateInfo.isToday ? '#3B82F6' : '#6B7280'
                                    }}>
                                        {dayName}
                                    </Text>
                                    <TouchableOpacity
                                        style={{
                                            width: 56,
                                            height: 64,
                                            borderRadius: 16,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            backgroundColor: isBooked ? '#10B981' : '#F3F4F6',
                                            borderWidth: dateInfo.isToday ? 2 : 0,
                                            borderColor: dateInfo.isToday ? '#3B82F6' : 'transparent'
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            color: isBooked ? 'white' : '#9CA3AF'
                                        }}>
                                            {dateInfo.day}
                                        </Text>
                                        <Text style={{
                                            fontSize: 12,
                                            color: isBooked ? '#D1FAE5' : '#D1D5DB'
                                        }}>
                                            {dateInfo.month}
                                        </Text>
                                        {isBooked && (
                                            <View style={{
                                                position: 'absolute',
                                                top: -4,
                                                right: -4,
                                                width: 16,
                                                height: 16,
                                                backgroundColor: '#065F46',
                                                borderRadius: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={{ fontSize: 10, color: 'white' }}>✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 12, height: 12, backgroundColor: '#10B981', borderRadius: 6, marginRight: 8 }} />
                    <Text style={{ fontSize: 12, color: '#065F46' }}>Booked Days</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 12, height: 12, backgroundColor: '#D1D5DB', borderRadius: 6, marginRight: 8 }} />
                    <Text style={{ fontSize: 12, color: '#065F46' }}>Available</Text>
                </View>
            </View>
        </View>
    );
};
export default ClassesDetails;