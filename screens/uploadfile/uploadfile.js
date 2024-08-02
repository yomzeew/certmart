export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType
    });
  
    try {
      const response = await fetch('https://your-server-endpoint/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
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