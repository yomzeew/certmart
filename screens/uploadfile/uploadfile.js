import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { updateProfilePic } from "../../settings/endpoint";
import { Platform } from "react-native";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType
  });

  try {
    const token = await AsyncStorage.getItem()
    const response = await fetch('https://your-server-endpoint/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });

    const result = await response.json();
    if (response.ok) {
      // Alert.alert('Success', 'File uploaded successfully.');
    } else {
      // Alert.alert('Error', 'File upload failed.');
    }
  } catch (error) {
    console.error('File upload error:', error);
    //   Alert.alert('Error', 'An error occurred while uploading the file.');
  }
};




// Function to handle file upload
export const uploadImage= async (uri, studentid) => {
  const formData = new FormData();

  // Get the file name and type from the uri
  const fileName = uri.split('/').pop();
  const fileType = fileName.split('.').pop();
  const mimeType = `image/${fileType}`;

  // Ensure compatibility for both Android and iOS
  const image = {
    uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
    name: fileName,
    type: mimeType,
  };

  // Append the image file and student ID
  formData.append('image', image); // 'image' is the key expected by your API
  formData.append('studentid', studentid);
  try {
    // Make the POST request with Axios
    const response = await axios.post(updateProfilePic, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle success
    console.log('File uploaded successfully:', response.data);
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error response:', error.response.data);
      console.log(error.response.data.error)
      // seterrorMsg(error.response.data.error)
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Error request:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error message:', error.message);
    }
  }
};


// Usage example:
