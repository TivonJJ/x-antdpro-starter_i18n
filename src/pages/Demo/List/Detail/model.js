import { getDetail,update } from '@/services/demo';

export default {
    namespace:'demoDetail',
    state:{
        detail:null
    },
    effects:{
        *getDetail({payload},{call,put}){
            const detail = yield call(getDetail,payload);
            yield put({
                type:'changeState',
                payload:{
                    detail
                }
            })
        },
        *close({payload},{call}){
            yield call(update,{no:payload,status:2})
        }
    },
    reducers:{
        changeState(state,{payload}){
            return {
                ...state,
                ...payload
            }
        }
    }
}
