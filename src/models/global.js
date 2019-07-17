function checkIsFullScreen() {
    return document.fullScreen||document.mozFullScreen||document.webkitIsFullScreen;
}

function toggleFullScreenMode(el) {
    const isFullScreen = checkIsFullScreen();
    if (!isFullScreen) {// 进入全屏
        const requestFullScreen = el.requestFullscreen || el.mozRequestFullScreen || el.mozRequestFullScreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        requestFullScreen && requestFullScreen();
    } else {// 退出全屏
        const exitFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
        exitFullScreen && exitFullScreen();
    }
    return !isFullScreen;
}

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
