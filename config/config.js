// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackplugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';

const APP_METADATA = getGlobalParams();
global['APP_METADATA'] = APP_METADATA;

export default {
    proxy: {
        '/api': {
            target: 'http://x.apiserver.com/',
            changeOrigin: true,
            logLevel: 'debug',
        },
    },
    devtool: APP_METADATA.env === 'development' ? 'source-map' : undefined,
    // add for transfer to umi
    plugins: [
        [
            'umi-plugin-react',
            {
                antd: true,
                dva: {
                    hmr: true,
                },
                locale: {
                    enable: true, // default false
                    default: 'zh-CN', // default zh-CN
                    baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
                },
                dynamicImport: {
                    loadingComponent: './components/PageLoading/index',
                },
                pwa: defaultSettings.pwa
                    ? {
                        workboxPluginMode: 'InjectManifest',
                        workboxOptions: {
                            importWorkboxFrom: 'local',
                        },
                    }
                    : {},
                ...(!process.env.TEST && os.platform() === 'darwin'
                    ? {
                        dll: {
                            include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
                            exclude: ['@babel/runtime'],
                        },
                        hardSource: true,
                    }
                    : {}),
            },
        ],
    ],
    define: {
        APP_TYPE: process.env.APP_TYPE || '',
        APP_METADATA,
    },
    targets: { ie: 11 },
    // 路由配置
    routes: pageRoutes,
    history: 'browser',
    // history: 'hash',
    base: APP_METADATA.baseUrl,
    publicPath: APP_METADATA.baseUrl,
    runtimePublicPath: true,
    // Theme for antd
    // https://ant.design/docs/react/customize-theme-cn
    theme: defaultSettings.customTheme,
    // externals: {
    //     '@antv/data-set': 'DataSet',
    // },
    ignoreMomentLocale: false,
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    cssLoaderOptions: {
        modules: true,
        getLocalIdent: (context, localIdentName, localName) => {
            if (
                context.resourcePath.includes('node_modules') ||
                context.resourcePath.includes('ant.design.pro.less') ||
                context.resourcePath.includes('global.less')
            ) {
                return localName;
            }
            const match = context.resourcePath.match(/src(.*)/);
            if (match && match[1]) {
                const antdProPath = match[1].replace('.less', '');
                const arr = slash(antdProPath)
                    .split('/')
                    .map((a) => a.replace(/([A-Z])/g, '-$1'))
                    .map((a) => a.toLowerCase());
                return `xst-${arr.join('-')}-${localName}`.replace(/--/g, '-');
            }

            return localName;
        },
    },
    chainWebpack: webpackplugin,
    cssnano: {
        mergeRules: false,
    },
};

function getGlobalParams() {
    const BUILD_ENV = process.env.BUILD_ENV || process.env.NODE_ENV;
    const startParams = process.argv
        .slice(2)
        .map(arg => arg.split('='))
        .reduce((args, [value, key]) => {
            if (/^--/.test(value)) {
                args[value.replace(/^--/, '')] = key;
            }
            return args;
        }, {});
    const PUBLIC_PATH = startParams.basePath || '/';
    console.log('Base Path', PUBLIC_PATH);
    return {
        env: BUILD_ENV,
        baseUrl: PUBLIC_PATH,
        buildVersion: startParams['bv'],
        StartParams: startParams,
    };
}
