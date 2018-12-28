"use strict";
import {formatMessage} from 'umi/locale';

export default {
    namespace: 'global',

    state: {
        collapsed: false,
        isFullScreen: checkIsFullScreen(),
    },

    effects: {
        *toggleFullScreen({element=document.documentElement},{put}){
            const isFullScreen = toggleFullScreenMode(element);
            yield put({
                type:'changeState',
                payload:{
                    isFullScreen
                }
            });
            return isFullScreen;
        },
    },

    reducers: {
        changeLayoutCollapsed(state, {payload}) {
            return {
                ...state,
                collapsed: payload,
            };
        },
        changeState(state,{payload}){
            return {
                ...state,
                ...payload
            }
        },
    },
    subscriptions:{
        watchIsFullScreen({dispatch}){
            const onResize = ()=>{
                dispatch({
                    type:'changeState',
                    payload:{
                        isFullScreen:checkIsFullScreen()
                    }
                })
            };
            window.addEventListener('resize',onResize);
            return ()=>{
                window.removeEventListener('resize',onResize);
            }
        }
    }
};

function checkIsFullScreen() {
    return document.fullScreen||document.mozFullScreen||document.webkitIsFullScreen;
}

function toggleFullScreenMode(el) {
    const isFullScreen = checkIsFullScreen();
    if (!isFullScreen) {//进入全屏
        (el.requestFullscreen && el.requestFullscreen()) ||
        (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
        (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el.msRequestFullscreen && el.msRequestFullscreen());
    } else {	//退出全屏
        document.exitFullscreen ? document.exitFullscreen() :
            document.mozCancelFullScreen ? document.mozCancelFullScreen() :
                document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
    }
    return !isFullScreen;
}
