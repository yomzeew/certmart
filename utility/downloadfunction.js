import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';

export const downloadFile = async (url, fileName) => {
  try {
    const fileUri = FileSystem.cacheDirectory + fileName;

    // Download directly to cache
    const { uri, status } = await FileSystem.downloadAsync(url, fileUri);

    if (status !== 200) throw new Error(`Download failed with status ${status}`);

    if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        Alert.alert('Permission denied', 'Cannot save file without permission.');
        return;
      }

      // Create a new file in selected folder
      const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        'application/pdf'
      );

      // Read the downloaded file as base64
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Write the base64 content to the new SAF file
      await FileSystem.StorageAccessFramework.writeAsStringAsync(
        newFileUri,
        base64Data,
        { encoding: FileSystem.EncodingType.Base64 }
      );

      Alert.alert('Success ✅', 'File saved to selected folder.');
      console.log('Saved to:', newFileUri);
    } else {
      // iOS — open directly from cache
      Alert.alert('Success ✅', 'File downloaded successfully.');
      await Linking.openURL(uri);
    }
  } catch (error) {
    console.error('Download error:', error);
  }
};
