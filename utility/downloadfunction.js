import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Alert,Platform } from 'react-native'
export const downloadFile = async (fileUrl,fileName) => {
    try {
       
    
        // Use cache directory which is always writable
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
  
        // Check permissions (required for Android)
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission required',
            'Please allow storage access to download files',
            [{ text: 'OK' }]
          );
          return;
        }
  
        // Download the file
        const downloadResumable = FileSystem.createDownloadResumable(
          fileUrl,
          fileUri,
          {},
        );
  
        const { uri } = await downloadResumable.downloadAsync();
        console.log('File downloaded to:', uri);
  
        // Handle the downloaded file based on platform
        if (Platform.OS === 'android') {
          // For Android, move from cache to downloads
          const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (permissions.granted) {
            const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              fileName,
              'application/pdf'
            );
            await FileSystem.copyAsync({ from: uri, to: newUri });
            Alert.alert('Success', 'File saved to Downloads');
          }
        } else {
          // For iOS, share the file
          await Sharing.shareAsync(uri);
        }
      } catch (error) {
        console.error('Download error:', error);
        Alert.alert(
          'Download Failed',
          'Could not download the file. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }