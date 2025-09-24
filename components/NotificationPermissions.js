import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as Notifications from 'expo-notifications';
import notificationService from '../../utils/notificationService';

const NotificationPermissions = ({ onPermissionGranted, onPermissionDenied }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const settings = await notificationService.getNotificationSettings();
      setPermissionStatus(settings?.granted ? 'granted' : 'denied');
    } catch (error) {
      console.error('Error checking permission status:', error);
    }
  };

  const requestPermissions = async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermissions();

      if (granted) {
        const token = await notificationService.getPushToken();
        if (token) {
          await notificationService.savePushToken(token);
        }

        setPermissionStatus('granted');
        Alert.alert(
          'Success! 🔔',
          'You will now receive notifications for course updates, payment confirmations, and important announcements.',
          [{ text: 'OK', onPress: onPermissionGranted }]
        );
      } else {
        setPermissionStatus('denied');
        Alert.alert(
          'Permission Denied',
          'To receive important updates about your courses and payments, please enable notifications in your device settings.',
          [
            { text: 'Cancel', onPress: onPermissionDenied },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Notifications.requestPermissionsAsync();
                } else {
                  // For Android, user needs to manually go to settings
                  Alert.alert('Go to Settings > Apps > CertMart > Notifications and enable notifications');
                }
                onPermissionDenied();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions. Please try again.');
      setPermissionStatus('denied');
    } finally {
      setIsLoading(false);
    }
  };

  if (permissionStatus === 'granted') {
    return null; // Don't show component if already granted
  }

  return (
    <View style={{
      backgroundColor: '#FFF3CD',
      padding: 16,
      margin: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FFEAA7',
      elevation: 2
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#856404', marginRight: 8 }}>
          🔔
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#856404', flex: 1 }}>
          Enable Notifications
        </Text>
      </View>

      <Text style={{ fontSize: 14, color: '#856404', marginBottom: 16, lineHeight: 20 }}>
        Stay updated with course announcements, payment confirmations, and important reminders.
        Enable notifications to get the most out of your learning experience!
      </Text>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          onPress={onPermissionDenied}
          style={{
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#D4A574',
            backgroundColor: 'transparent'
          }}
        >
          <Text style={{ textAlign: 'center', color: '#856404', fontWeight: '500' }}>
            Maybe Later
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={requestPermissions}
          disabled={isLoading}
          style={{
            flex: 2,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 6,
            backgroundColor: isLoading ? '#ccc' : '#28a745',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={{ color: 'white', fontWeight: '600' }}>
              Enable Notifications
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationPermissions;
