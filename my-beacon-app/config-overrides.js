// config-overrides.js

module.exports = function override(config, env) {
    // Suppress source map warnings from node_modules
    if (!config.ignoreWarnings) {
      config.ignoreWarnings = [];
    }
    config.ignoreWarnings.push({
      module: /@mediapipe\/tasks-vision/
    });
    return config;
  };