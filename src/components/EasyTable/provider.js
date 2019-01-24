import request from "@/utils/request";
import {createPagination} from "@/utils";

const NameSpace = 'easyTableProvider';
const ShowLoading = 'SHOW',
    HideLoading = 'HIDE';
let SourceActionMap = {};

// Redux 数据池
const model = {
    namespace:NameSpace,
    state:{
        params:{},
        page:{},
        loading:{}
    },
    effects:{
        *fetch({payload:{name,params,pagination}},{put,call,select}){
            const state = yield select(state=>state[NameSpace]);
            check(name,state);
            if(undefined === params){
                params = state.params[name];
            }else {
                yield put({
                    type:'update',
                    payload:{
                        name,
                        params
                    }
                });
            }
            if(!pagination){
                pagination = createPagination()
            }else {
                pagination = {
                    ...state.page[name],
                    ...pagination
                }
            }
            return yield loadData(name, pagination, params, put, call);
        },
        *search({payload:{name,params}},{put,call,select}){
            const state = yield select(state=>state[NameSpace]);
            check(name,state);
            yield put({
                type:'update',
                payload:{
                    name,
                    params
                }
            });
            return yield loadData(name, state.page[name], params, put, call);
        },
        *paging({payload:{name,pagination}},{put,call,select}){
            const state = yield select(state=>state[NameSpace]);
            check(name,state);
            return yield loadData(name, {
                ...state.page[name],
                ...pagination
            }, state.params[name], put, call);
        },
        *refresh({payload:{name,pagination}},{put,call,select}){
            const state = yield select(state=>state[NameSpace]);
            check(name,state);
            if(pagination){
                pagination = {
                    ...state.page[name],
                    ...pagination
                }
            }else {
                pagination = state.page[name];
            }
            return yield loadData(name,pagination,state.params[name],put,call);
        },
    },
    reducers:{
        // 数据池初始化
        _initialize(state,{payload:{name,source}}){
            let fetch = source;
            if(typeof fetch === 'string'){
                fetch = ((params)=> {
                    return request.post(source,params);
                });
            }
            SourceActionMap[name] = fetch;
            if(state.page[name])return state;
            state.page[name] = createPagination();
            state.loading[name] = false;
            return {...state};
        },
        update(state,{payload}){
            const {name} = payload;
            if('page' in payload){
                state.page = {
                    ...state.page,
                    [name]:payload.page
                };
            }
            if('params' in payload){
                state.params[name] = payload.params
            }
            return {...state};
        },
        // 清空数据池
        clean(state,{payload:{name}}){
            if(null == name){
                state.page = {};
            }else {
                state.page[name] = undefined;
                delete state.page[name];
            }
            return {...state};
        },
        loading(state,{payload:{name,action}}){
            state.loading = {
                ...state.loading,
                [name]: action === ShowLoading
            };
            return {...state}
        }
    }
};
if(!window.g_app._models.some(({namespace})=>namespace===NameSpace)){
    window.g_app.model(model);
}

function *loadData(name,page,params,put,call) {
    yield put({
        type:'loading',
        payload:{
            name,
            action:ShowLoading
        }
    });
    try{
        const fetch = SourceActionMap[name];
        const result = yield call(fetch,{
            page_num:page.current,
            page_size:page.pageSize,
            ...params
        });
        page.total = result.total;
        page.data = result.data;
        yield put({
            type:'update',
            payload:{
                name,
                page
            }
        });
    }catch (e) {
        throw e;
    }finally {
        yield put({
            type:'loading',
            payload:{
                name,
                action:HideLoading
            }
        });
    }
    return page;
}

function check(name,state) {
    if(typeof name !== 'string') throw new TypeError('Argument [name] must be a string,But got a '+name);
    if(!state.page[name])throw new Error(name+' is not fount,May not be initialized or has been destroyed!');
}
