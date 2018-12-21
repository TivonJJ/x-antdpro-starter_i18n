// Change theme plugin
import MergeLessPlugin from 'antd-pro-merge-less';
import AntDesignThemePlugin from 'antd-pro-theme-webpack-plugin';
import path from 'path';

export default config => {
    // init loader
    config.module.rule('yml').test(/\.ya?ml$/).use('yaml').loader('yaml-loader');
    config.resolve.alias.set('config', path.resolve(__dirname, '../src/config', APP_METADATA.env));

    // 将所有 less 合并为一个供 themePlugin使用
    // const outFile = path.join(__dirname, '../.temp/ant-design-pro.less');
    // const stylesDir = path.join(__dirname, '../src/');
    //
    // config.plugin('merge-less').use(MergeLessPlugin, [
    //     {
    //         stylesDir,
    //         outFile,
    //     },
    // ]);

    // config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
    //     {
    //         antDir: path.join(__dirname, '../node_modules/antd'),
    //         stylesDir,
    //         varFile: path.join(__dirname, '../src/styles/mixins.less'),
    //         mainLessFile: outFile, //     themeVariables: ['@primary-color'],
    //         indexFileName: 'index.html',
    //     },
    // ]);
};
