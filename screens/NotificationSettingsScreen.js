import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../../utils/notificationService';

const NotificationSettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    paymentSuccess: true,
    courseEnrollment: true,
    couponApplied: true,
    courseReminders: false,
    generalAnnouncements: true,
    pushNotifications: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      console.log('Notification settings saved');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset all notification settings to their default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultSettings = {
              paymentSuccess: true,
              courseEnrollment: true,
              couponApplied: true,
              courseReminders: false,
              generalAnnouncements: true,
              pushNotifications: true,
            };
            saveSettings(defaultSettings);
          },
        },
      ]
    );
  };

  const testNotification = async () => {
    setIsLoading(true);
    try {
      await notificationService.scheduleNotification(
        'Test Notification 🔔',
        'This is a test notification to check if your settings are working correctly.',
        { type: 'test' }
      );
      Alert.alert('Success', 'Test notification scheduled! You should see it shortly.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification. Please check your permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationStatus = async () => {
    try {
      const status = await notificationService.getNotificationSettings();
      const isEnabled = await notificationService.areNotificationsEnabled();

      Alert.alert(
        'Notification Status',
        `Notifications are ${isEnabled ? 'ENABLED' : 'DISABLED'}\n\n` +
        `iOS Status: ${status?.ios?.status || 'Unknown'}\n` +
        `Android Importance: ${status?.android?.importance || 'Unknown'}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Unable to check notification status.');
    }
  };

  const SettingRow = ({ title, subtitle, value, onToggle, iconName }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={iconName} size={24} color="#e74c3c" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: '#e74c3c' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Types</Text>

        <SettingRow
          title="Payment Success"
          subtitle="Get notified when your payments are processed successfully"
          value={settings.paymentSuccess}
          onToggle={() => toggleSetting('paymentSuccess')}
          iconName="payment"
        />

        <SettingRow
          title="Course Enrollment"
          subtitle="Notifications for successful course enrollments"
          value={settings.courseEnrollment}
          onToggle={() => toggleSetting('courseEnrollment')}
          iconName="school"
        />

        <SettingRow
          title="Coupon Applied"
          subtitle="Get notified when coupons are successfully applied"
          value={settings.couponApplied}
          onToggle={() => toggleSetting('couponApplied')}
          iconName="local-offer"
        />

        <SettingRow
          title="Course Reminders"
          subtitle="Reminders about upcoming classes and deadlines"
          value={settings.courseReminders}
          onToggle={() => toggleSetting('courseReminders')}
          iconName="alarm"
        />

        <SettingRow
          title="General Announcements"
          subtitle="Important updates and announcements from CertMart"
          value={settings.generalAnnouncements}
          onToggle={() => toggleSetting('generalAnnouncements')}
          iconName="announcement"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>

        <SettingRow
          title="Push Notifications"
          subtitle="Enable/disable all push notifications"
          value={settings.pushNotifications}
          onToggle={() => toggleSetting('pushNotifications')}
          iconName="notifications"
        />
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={testNotification}
          disabled={isLoading}
        >
          <MaterialIcons name="notifications-active" size={20} color="#fff" />
          <Text style={styles.testButtonText}>
            {isLoading ? 'Sending...' : 'Send Test Notification'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statusButton}
          onPress={getNotificationStatus}
        >
          <MaterialIcons name="info" size={20} color="#666" />
          <Text style={styles.statusButtonText}>Check Notification Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetToDefaults}
        >
          <MaterialIcons name="refresh" size={20} color="#e74c3c" />
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <MaterialIcons name="info-outline" size={20} color="#666" />
        <Text style={styles.infoText}>
          Changes to notification settings will take effect immediately.
          You can always change these settings later.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef7f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    lineHeight: 16,
  },
  actionSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  testButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  testButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  statusButton: {
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 12,
  },
  statusButtonText: {
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  resetButtonText: {
    color: '#e74c3c',
    fontWeight: '500',
    marginLeft: 8,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#e8f4f8',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    lineHeight: 18,
    flex: 1,
  },
});

export default NotificationSettingsScreen;
