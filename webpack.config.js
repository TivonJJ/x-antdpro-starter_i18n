const path = require('path');

// This configuration is not actually used in webpack,
// it's only used by the IDE to automatically identify alias configuration information.
module.exports = {
    resolve: {
        alias: {
            '@':path.resolve(__dirname,'src'),
            'config':path.resolve(__dirname,'src/config/development')
        }
    }
};
