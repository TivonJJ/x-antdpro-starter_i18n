import '@babel/polyfill';
import {message} from 'antd';

window.appMeta = APP_METADATA;

window.addEventListener("unhandledrejection", function (event) {
    if(event.reason.type === 'NetError'){
        event.preventDefault();
        message.error(event.reason.message);
        console.error('Error handled on unhandledrejection',event.reason.message);
    }
});
