const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure SVG transformer
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

// Remove 'svg' from asset extensions and add to source extensions
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);
config.resolver.sourceExts.push('svg');

module.exports = config;
