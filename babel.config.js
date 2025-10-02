module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // Must be last
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};