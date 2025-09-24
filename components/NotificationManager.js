import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import notificationService from '../utils/notificationService';

const NotificationManager = () => {
  useEffect(() => {
    // Set up notification listeners
    const setupNotifications = async () => {
      try {
        // Request permissions on app start
        const hasPermission = await notificationService.requestPermissions();

        if (hasPermission) {
          const token = await notificationService.getPushToken();
          if (token) {
            await notificationService.savePushToken(token);
            console.log('Push token saved:', token);
          }
        }

        // Set up notification listeners
        notificationService.addNotificationListeners(
          // Handle received notifications
          (notification) => {
            console.log('Notification received:', notification);
            // You can add custom handling here if needed
          },
          // Handle notification responses
          (response) => {
            console.log('Notification response:', response);
            const { notification } = response;

            // Handle different notification types
            if (notification.request.content.data?.type) {
              const { type, courseName, amount, couponCode, discount } = notification.request.content.data;

              switch (type) {
                case 'payment_success':
                  console.log(`Payment successful for ${courseName}: ₦${amount}`);
                  break;
                case 'course_enrollment':
                  console.log(`Enrolled in course: ${courseName}`);
                  break;
                case 'coupon_applied':
                  console.log(`Coupon ${couponCode} applied: saved ₦${discount}`);
                  break;
                default:
                  console.log('Unknown notification type:', type);
              }
            }
          }
        );

        // Get initial notification if app was opened from notification
        const initialNotification = await Notifications.getLastNotificationResponseAsync();
        if (initialNotification) {
          console.log('App opened from notification:', initialNotification);
        }

      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();

    // Cleanup listeners on unmount
    return () => {
      notificationService.removeNotificationListeners();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default NotificationManager;
