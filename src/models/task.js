import {notification} from 'antd';
import {formatMessage} from 'umi/locale';
import { fetchTasks } from '../services/task';
import { createPagination } from '../utils';


function createTaskPagination() {
    return createPagination({
        showSizeChanger:false,
        showQuickJumper:false
    })
}
export default {
    namespace:'task',
    state: {
        tasksPage: createPagination(),
        hasUnread:false
    },
    effects:{
        *fetch({ payload }, { call, put ,select}){
            const pagination = yield select((state) => state.task.tasksPage);
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
        *notice({payload={}},{put}){
            if(payload.message !== false){
                notification.success({
                    message: formatMessage({id:'Component.taskBar.noticeTitle'}),
                    description: payload.message
                })
            }
            const {showMark = true} = payload;
            yield put({
                type:'changeState',
                payload:{
                    hasUnread:!!showMark
                }
            })
        },
    },
    reducers:{
        changeState(state,{payload}){
            return {
                ...state,
                ...payload
            }
        },
        resetTaskPage(state){
            return {
                ...state,
                tasksPage: createTaskPagination()
            }
        },
    }
}
