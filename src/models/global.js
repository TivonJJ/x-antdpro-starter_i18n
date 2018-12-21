"use strict";
import { fetchTasks } from '../services/task';
import { createNormalPagination } from '../utils';
import {notification} from 'antd';
import {formatMessage} from 'umi/locale';

export default {
    namespace: 'global',

    state: {
        collapsed: false,
        isFullScreen: checkIsFullScreen(),
        tasksPage: createPagination(),
        taskCount: 0
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
        *fetchTasks({ payload }, { call, put ,select}){
            const pagination = yield select((state) => state.global.tasksPage);
            if (payload.page) Object.assign(pagination, payload.page);
            const result = yield call(fetchTasks, {
                ...payload,
                page_num: pagination.current,
                page_size: pagination.page_size,
                page: undefined
            });
            pagination.total = result.total;
            pagination.data = result.data;
            yield put({type: 'changeState', payload: {pagination}});
        },
        *syncPendingTaskCount({notice},{call,put}){
            const result = yield call(fetchTasks, {status: 0, page_num: 1, page_size: 1});
            yield put({
                type: 'changeState',
                payload: {
                    taskCount: result.total
                }
            });
            if(notice){
                const config = {
                    message:formatMessage({id:'Component.taskBar.noticeTitle'}),
                };
                if(typeof notice !== 'boolean'){
                    config.description = notice;
                }
                notification.success(config)
            }
        }
    },

    reducers: {
        changeLayoutCollapsed(state, {payload}) {
            return {
                ...state,
                collapsed: payload,
            };
        },
        changeLanguage(state,{payload}){
            return {
                ...state,
                language:payload
            }
        },
        changeState(state,{payload}){
            return {
                ...state,
                ...payload
            }
        },
        resetTaskPage(state){
            return {
                ...state,
                tasksPage:createPagination()
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

function createPagination() {
    return createNormalPagination({
        showSizeChanger:false,
        showQuickJumper:false
    })
}

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
