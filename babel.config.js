module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'module:@react-native/babel-preset', // Default React Native preset
      '@babel/preset-flow', // Required for Flow syntax
    ],
    plugins: [
      // Add other plugins here (if any)
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};