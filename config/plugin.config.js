// Change theme plugin
import path from 'path';

export default config => {
    // init loader
    // config.module.rule('yml').test(/\.ya?ml$/).use('yaml').loader('yaml-loader');
    config.resolve.alias.set('config', path.resolve(__dirname, '../src/config', APP_METADATA.env));
};
