import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allavailablecourse } from "../../../settings/endpoint";

export const fetchallavailablecourse = async (setshowpreloader) => {
  try {
    setshowpreloader(true);
    const token = await AsyncStorage.getItem("token");

    const response = await axios.get(allavailablecourse, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const getdata = response.data;
    console.log(getdata);

    const getcourse = [...new Set(getdata.map((item) => `${item.course}`))];

    return Promise.resolve(getcourse);
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  } finally {
    setshowpreloader(false);
  }
};
