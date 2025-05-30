import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { colorred } from '../../constant/color';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';

const DateModal = ({ setDateOfBirth, DateOfBirth, closetwo }) => {
  const [date, setDate] = useState(dayjs());

  // Update and close modal after date selection
  const setnewdate = (selectedDate) => {
    setDateOfBirth(dayjs(selectedDate).format('YYYY-MM-DD')); 
    closetwo(false); // Close the modal
  };

  return (
    <View  style={{ zIndex: 50, elevation: 50 }} className="rounded-2xl p-3 z-50 bg-slate-100 top-16 absolute">
    <View className="items-end"><TouchableOpacity onPress={()=>closetwo(false)}><Text><FontAwesome size={20} name='times' color={colorred}/></Text></TouchableOpacity></View>
      <DateTimePicker
        mode="single"
        date={date}
        selectedItemColor={colorred}
        onChange={(params) => {
          setDate(params.date); // Update the date state
          setnewdate(params.date); // Update the date and close the modal
        }}
      />
    </View>
  );
};

export default DateModal;

// In your other component
