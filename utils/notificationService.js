import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Notification service class
class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Request notification permissions
  async requestPermissions() {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'CertMart Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF0000',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }

      console.log('Notification permissions granted!');
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Get push token
  async getPushToken() {
    try {
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Push token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Save push token to storage
  async savePushToken(token) {
    try {
      await AsyncStorage.setItem('pushToken', token);
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  // Get saved push token
  async getSavedPushToken() {
    try {
      return await AsyncStorage.getItem('pushToken');
    } catch (error) {
      console.error('Error getting saved push token:', error);
      return null;
    }
  }

  // Schedule local notification
  async scheduleNotification(title, body, data = {}, trigger = null) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: trigger || { seconds: 1 },
      });

      console.log('Notification scheduled with ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  // Schedule payment success notification
  async schedulePaymentSuccessNotification(courseName, amount) {
    const settings = await this.getNotificationSettings();
    if (!settings?.paymentSuccess) {
      console.log('Payment success notifications disabled by user');
      return null;
    }

    return await this.scheduleNotification(
      'Payment Successful! 🎉',
      `Your payment of ₦${amount} for "${courseName}" has been processed successfully.`,
      { type: 'payment_success', courseName, amount }
    );
  }

  // Schedule course enrollment notification
  async scheduleCourseEnrollmentNotification(courseName) {
    const settings = await this.getNotificationSettings();
    if (!settings?.courseEnrollment) {
      console.log('Course enrollment notifications disabled by user');
      return null;
    }

    return await this.scheduleNotification(
      'Course Enrollment Successful! 📚',
      `Welcome to "${courseName}"! Your enrollment has been confirmed.`,
      { type: 'course_enrollment', courseName }
    );
  }

  // Schedule coupon applied notification
  async scheduleCouponAppliedNotification(couponCode, discount) {
    const settings = await this.getNotificationSettings();
    if (!settings?.couponApplied) {
      console.log('Coupon applied notifications disabled by user');
      return null;
    }

    return await this.scheduleNotification(
      'Coupon Applied Successfully! 🎊',
      `Coupon "${couponCode}" applied! You saved ₦${discount}`,
      { type: 'coupon_applied', couponCode, discount }
    );
  }

  // Get user notification settings
  async getNotificationSettings() {
    try {
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }

      // Return defaults if no settings saved
      return {
        paymentSuccess: true,
        courseEnrollment: true,
        couponApplied: true,
        courseReminders: false,
        generalAnnouncements: true,
        pushNotifications: true,
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        paymentSuccess: true,
        courseEnrollment: true,
        couponApplied: true,
        courseReminders: false,
        generalAnnouncements: true,
        pushNotifications: true,
      };
    }
  }

  // Schedule reminder notification
  async scheduleReminderNotification(title, body, hoursFromNow = 1) {
    const trigger = {
      hour: new Date().getHours(),
      minute: new Date().getMinutes() + 1,
      repeats: false,
    };

    return await this.scheduleNotification(title, body, {}, trigger);
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  // Add notification listeners
  addNotificationListeners(onNotificationReceived, onNotificationResponse) {
    // Listener for when notification is received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listener for when user interacts with notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    });
  }

  // Remove notification listeners
  removeNotificationListeners() {
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }
    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }
  }

  // Get notification settings
  async getNotificationSettings() {
    try {
      const settings = await Notifications.getNotificationSettingsAsync();
      console.log('Notification settings:', settings);
      return settings;
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return null;
    }
  }

  // Check if notifications are enabled
  async areNotificationsEnabled() {
    try {
      const settings = await this.getNotificationSettings();
      return settings?.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
             settings?.android?.importance === Notifications.AndroidImportance.MAX;
    } catch (error) {
      console.error('Error checking notification status:', error);
      return false;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
export {
  NotificationService,
  Notifications as ExpoNotifications,
  Device
};
