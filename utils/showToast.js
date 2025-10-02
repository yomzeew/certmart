import { Vibration } from "react-native";
import Toast from "react-native-toast-message";

const showToast = (type, title, message) => {
  // Vibrate depending on type
  if (type === "error") {
    Vibration.vibrate(500); // vibrate 500ms on error
  } else if (type === "success") {
    Vibration.vibrate([100, 200, 100]); // pattern: vibrate, pause, vibrate
  }

  // Show toast
  Toast.show({
    type,
    text1: title,
    text2: message,
  });
};

export default showToast;
