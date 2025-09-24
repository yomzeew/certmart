import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

/**
 * Validates required payment fields
 * @param {Object} fields - Object containing fields to validate
 * @returns {boolean} - True if all fields are valid
 */
export const validatePaymentFields = (fields) => {
  const requiredFields = {
    studentid: 'Student ID',
    eventid: 'Event Code',
    amountpaid: 'Amount',
    currency: 'Currency'
  };

  for (const [key, label] of Object.entries(requiredFields)) {
    const value = fields[key];
    if (!value && value !== 0) {
      console.warn(`Validation Error: Missing value for "${key}"`, { value });
      Alert.alert("Validation Error", `Missing required field: ${label}`);
      return false;
    }
  }
  return true;
};

/**
 * Gets authentication token from AsyncStorage
 * @returns {Promise<string|null>} - Authentication token or null
 */
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.warn("Auth Error: No token found in storage.");
      Alert.alert("Authentication Error", "You are not logged in. Please login again.");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    Alert.alert("Error", "Failed to retrieve authentication token");
    return null;
  }
};

/**
 * Formats currency amount with proper decimal places
 * @param {number|string} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted amount string
 */
export const formatCurrency = (amount, currency = 'NGN') => {
  const numAmount = Number(amount);
  if (isNaN(numAmount)) return '0.00';

  const currencySymbols = {
    NGN: '₦',
    USD: '$',
    GHS: '₵',
    KES: 'KSh',
    ZAR: 'R'
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${numAmount.toFixed(2)}`;
};

/**
 * Creates a timeout promise for network requests
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise} - Promise that rejects after timeout
 */
export const createTimeoutPromise = (timeoutMs) => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request Timeout")), timeoutMs)
  );
};

/**
 * Handles payment errors with user-friendly messages
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export const handlePaymentError = (error) => {
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data ||
    error.message ||
    "Unknown Error";

  console.error("Payment Error:", errorMessage, { error });

  if (error.message === "Request Timeout") {
    return "The request timed out. Please check your internet connection and try again.";
  }

  if (error.response?.status === 401) {
    return "Authentication failed. Please login again.";
  }

  if (error.response?.status === 400) {
    return "Invalid payment data. Please check your information and try again.";
  }

  if (error.response?.status >= 500) {
    return "Server error. Please try again later.";
  }

  return `Payment failed: ${errorMessage}`;
};

/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * Gets payment method display information
 * @param {string} method - Payment method code
 * @returns {Object} - Payment method info with icon and label
 */
export const getPaymentMethodInfo = (method) => {
  const methodMap = {
    card: { label: 'Card Payment', icon: 'credit-card' },
    bank: { label: 'Bank Transfer', icon: 'bank' },
    ussd: { label: 'USSD', icon: 'mobile' },
    qr: { label: 'QR Code', icon: 'qr-code' },
    mobile_money: { label: 'Mobile Money', icon: 'mobile' },
    bank_transfer: { label: 'Bank Transfer', icon: 'bank' },
    eft: { label: 'EFT', icon: 'credit-card' },
    apple_pay: { label: 'Apple Pay', icon: 'apple' }
  };

  return methodMap[method] || { label: 'Other', icon: 'credit-card' };
};
