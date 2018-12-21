import { insert } from '@/services/demo';

export default {
    namespace:'demoList',
    state:{
        query:{}
    },
    effects:{
        *insert({payload},{call}){
            yield call(insert,payload);
        }
    },
    reducers:{
        search(state,{payload}){
            return {
                ...state,
                query:payload
            }
        },
        refresh(state){
            return {
                ...state,
                query:{...state.query}
            }
        }
    }
}
