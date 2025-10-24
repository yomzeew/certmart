export const PAYMENT_CONFIG = {
  PAYSTACK_PUBLIC_KEY: __DEV__
    ? "pk_live_100d4761c8c122fe96c5e9d78e69265add54306b"  // Replace with your test key
    : "pk_live_100d4761c8c122fe96c5e9d78e69265add54306b", // Move to secure env in production
  FLUTTERWAVE_PUBLIC_KEY: __DEV__
    ?"FLWPUBK-74b0d6fda84c5308c666b3ba32ed316f-X"// "FLWPUBK_TEST-6b6f14ccde7c9436c92fd88e5d3a5958-X" //"FLWPUBK-74b0d6fda84c5308c666b3ba32ed316f-X"  // Replace with your Flutterwave TEST public key
    : "FLWPUBK-74b0d6fda84c5308c666b3ba32ed316f-X", //"FLWPUBK_TEST-6b6f14ccde7c9436c92fd88e5d3a5958-X", // Move to secure env in production

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
