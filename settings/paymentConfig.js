const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY;
const flutterwaveKey = process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
const env = process.env.EXPO_PUBLIC_NODE_ENV;
export const PAYMENT_CONFIG = {
  PAYSTACK_PUBLIC_KEY: paystackKey,
  FLUTTERWAVE_PUBLIC_KEY: flutterwaveKey,

  // Payment timeout settings
  PAYMENT_TIMEOUT: 360000, // 6 minutes
  NETWORK_TIMEOUT: 10000, // 10 seconds

  // Supported payment channels
  PAYMENT_CHANNELS: [
    "card",
    "bank",
    "ussd",
    "qr",
    "mobile_money",
    "bank_transfer",
    "eft",
    "apple_pay"
  ],

  // Currency settings
  DEFAULT_CURRENCY: "NGN",
  SUPPORTED_CURRENCIES: [
    { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
    { code: "ZAR", name: "South African Rand", symbol: "R" }
  ]
};

export const UI_CONFIG = {
  PRIMARY_COLOR: "#DC2626", // red-500
  SUCCESS_COLOR: "#10B981", // green-500
  ERROR_COLOR: "#EF4444", // red-400
  WARNING_COLOR: "#F59E0B", // yellow-500

  ANIMATION_DURATION: 300,
  LOADING_SIZE: 24,
  BORDER_RADIUS: 12
};
