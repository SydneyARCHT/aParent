// const { getDefaultConfig } = require("@expo/metro-config");
 
// const defaultConfig = getDefaultConfig(__dirname);
 
// defaultConfig.resolver.assetExts.push("cjs");
 
// module.exports = defaultConfig;

const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Remove 'cjs' from assetExts if it's there
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'cjs');

// Add 'cjs' to sourceExts
defaultConfig.resolver.sourceExts.push("cjs");

module.exports = defaultConfig;