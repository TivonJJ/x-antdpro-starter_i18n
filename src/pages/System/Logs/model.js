
export default {
    namespace : 'logs',
    state : {
        modalVisible:false,
        viewItem:{}
    },
    effects : {
    },
    reducers : {
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
