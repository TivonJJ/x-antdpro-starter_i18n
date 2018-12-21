import { removeEmptyProperty } from '@/utils';


export default {
    namespace : 'logs',
    state : {
        query : {},
        modalVisible:false,
        viewItem:{}
    },
    effects : {
        * handleSearch({ payload : { create_time, keywords, platform } }, { put }){
            const DATE_FORMAT = 'YYYY-MM-DD';
            const params = {
                keywords,
                platform
            };
            if(create_time && create_time.length===2){
                params.create_time_begin=create_time[0].utc(0).format(DATE_FORMAT);
                params.create_time_end=create_time[1].utc(0).format(DATE_FORMAT);
            }
            yield put({
                type : 'changeQuery',
                payload : removeEmptyProperty(params)
            });
        }
    },
    reducers : {
        changeQuery(state, { payload }){
            return {
                ...state,
                query : payload,
            };
        },

        changeDetailViewData(state,{payload}){
            return {
                ...state,
                viewItem:payload,
                modalVisible:true
            }
        },
        closeModal(state){
            return {
                ...state,
                modalVisible:false
            }
        }
    },

};
