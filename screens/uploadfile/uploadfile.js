import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const uploadImage = async (file, studentid, uri) => {
  const formData = new FormData();
  formData.append('file', {
    image: file.uri,
    studentid: studentid
  });

  try {
    const response = await fetch(uri, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });

    const result = await response.json();
    if (response.ok) {
      // Alert.alert('Success', 'File uploaded successfully.');
      console.log(result)
      console.log(response)
    } else {
      // Alert.alert('Error', 'File upload failed.');
    }
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