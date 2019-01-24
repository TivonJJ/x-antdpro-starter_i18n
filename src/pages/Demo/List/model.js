import { insert } from '@/services/demo';

export default {
    namespace:'demoList',
    state:{
    },
    effects:{
        *insert({payload},{call}){
            yield call(insert,payload);
        }
    },
}
