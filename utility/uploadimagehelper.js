import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import showToast from '../utils/showToast';


const pickAndUploadImage = async (options) => {
  const {
    aspect = [1, 1],
    uploadFn,
    successMessage,
    studentId,
    setShowLoader,
    fetchData,
  } = options;

  try {
    // Launch image picker (uses Android Photo Picker, no permission needed)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect,
      quality: 0.8,
    });

    // If user cancels, just return silently
    if (result.canceled) return;

    const asset = result.assets[0];
    const fileInfo = await FileSystem.getInfoAsync(asset.uri);
    const fileSizeInKB = fileInfo.size ? fileInfo.size / 1024 : 0;
    const maxSizeKB = 5120; // 5MB

    if (fileSizeInKB > maxSizeKB) {
      showToast(
        'error',
        'File Too Large',
        `Image is ${(fileSizeInKB / 1024).toFixed(2)}MB. Max size is 5MB.`
      );
      return;
    }

    // Show loader during upload
    if (setShowLoader) setShowLoader(true);

    // Call upload function
    await uploadFn(asset.uri, studentId);

    showToast('success', 'Success', successMessage);

    if (fetchData) fetchData();

  } catch (error) {
    console.error('Image upload error:', error);
    showToast('error', 'Upload Failed', error.message || 'Something went wrong');
  } finally {
    if (setShowLoader) setShowLoader(false);
  }
};

export default pickAndUploadImage;
