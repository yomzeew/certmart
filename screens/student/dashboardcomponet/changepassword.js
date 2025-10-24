import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Divider } from 'react-native-paper';
import { styles } from "../../../settings/layoutsetting";
import { colorred } from "../../../constant/color";
import Header from './header';
import { changepasswordFn } from '../../../utils/api';
import showToast from '../../../utils/showToast';

const Changepassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlechange = async () => {
    if (!oldPassword || !newPassword || !newPasswordConfirm) {
      showToast('error', 'Missing fields', 'Please fill in all fields.');
      return;
    }
    if (newPassword.length < 5) {
      showToast('error', 'Weak password', 'New password must be at least 5 characters.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      showToast('error', 'Mismatch', 'New passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { oldPassword, newPassword, newPasswordConfirm };
      const res = await changepasswordFn(payload);

      if (res?.error) {
        showToast('error', 'Change password failed', res.error);
        return;
      }

      showToast('success', 'Password Changed', 'Your password has been updated.');
      setOldPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (e) {
      showToast('error', 'Unexpected error', e?.message || 'Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.andriod, { flex: 1, backgroundColor: '#f8f9fa' }]}>
      <Header />

      <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
        <Text style={{ fontSize: 20, color: colorred, fontWeight: 'bold' }}>
          Change Password
        </Text>
        <Divider style={{ marginTop: 4, marginBottom: 10 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          <View style={{ gap: 16 }}>
            {/* Current Password */}
            <View>
              <Text style={{ marginBottom: 6, fontWeight: '500' }}>Current Password</Text>
              <TextInput
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
                placeholder="Enter current password"
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                }}
              />
            </View>

            {/* New Password */}
            <View>
              <Text style={{ marginBottom: 6, fontWeight: '500' }}>New Password</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Enter new password"
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                }}
              />
            </View>

            {/* Confirm Password */}
            <View>
              <Text style={{ marginBottom: 6, fontWeight: '500' }}>Confirm New Password</Text>
              <TextInput
                value={newPasswordConfirm}
                onChangeText={setNewPasswordConfirm}
                secureTextEntry
                placeholder="Re-enter new password"
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                }}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handlechange}
              disabled={submitting}
              style={{
                backgroundColor: submitting ? '#9ca3af' : colorred,
                paddingVertical: 14,
                borderRadius: 10,
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                  Update Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Changepassword;
