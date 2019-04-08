import request from "@/utils/request";
import {createPagination} from "@/utils";

const NameSpace = 'easyTableProvider';
let SourceActionMap = {};
let CallbackMap = {};

// Redux 数据池
const model = {
    namespace:NameSpace,
    state:{
        params:{},
        page:{},
        loading:{},
        errors:{},
        fixedParams:{}
    },
    effects:{
        *fetch({payload:{name,params,pagination}},{put,call,select}){
            const state = yield select(state=>state[NameSpace]);
            check(name,state);
            if(undefined === params){
                params = state.params[name];
            }else {
                yield put({
                    type:'_update',
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
            const fixedParams = state.fixedParams[name];
            return yield loadData(name, pagination, {...params,...fixedParams}, put, call);
        },
        *search({payload:{name,params}},{put,call,select}){
            const state = yield select(state=>state[NameSpace]);
            check(name,state);
            let mergeParams = {
                ...state.params[name],
                ...params
            };
            yield put({
                type:'_update',
                payload:{
                    name,
                    mergeParams
                }
            });
            return yield loadData(name, state.page[name], mergeParams, put, call);
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
        _initialize(state,{payload:{name,source,fixedParams,onDataLoaded,onError}}){
            let fetch = source;
            if(typeof fetch === 'string'){
                fetch = ((params)=> {
                    return request.post(source,params);
                });
            }
            SourceActionMap[name] = fetch;
            CallbackMap[name] = {onDataLoaded,onError};
            if(state.page[name])return state;
            state.page[name] = createPagination();
            state.loading[name] = false;
            state.fixedParams[name] = fixedParams;
            return {...state};
        },
        _update(state,{payload}){
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
            if('loading' in payload){
                state.loading[name] = payload.loading
            }
            if('error' in payload){
                state.errors[name] = payload.error;
            }
            if('fixedParams' in payload){
                state.fixedParams[name] = payload.fixedParams;
            }
            return {...state};
        },
        // 清空数据池
        clean(state,{payload:{name}}){
            if(null == name){
                state.page = {};
                state.params = {};
                state.loading = {};
                state.errors = {};
                state.fixedParams = {};
                SourceActionMap = {};
                CallbackMap = {};
            }else {
                delete state.page[name];
                delete state.params[name];
                delete state.loading[name];
                delete state.errors[name];
                delete state.fixedParams[name];
                delete SourceActionMap[name];
                delete CallbackMap[name];
            }
            return {...state};
        },
        // 修改list内的数据
        update(state,{payload:{name,data}}){
            if(!Array.isArray(data))throw new TypeError('Data must be an array');
            state.page[name].data = data;
            return {...state}
        },
        loading(state,{payload:{name,isLoading}}){
            state.loading = {
                ...state.loading,
                [name]: isLoading
            };
            return {...state}
        },
        error(state,{payload:{name,error}}){
            state.errors = {
                ...state.errors,
                [name]: error
            };
            return {...state}
        },
    }
};
if(!window.g_app._models.some(({namespace})=>namespace===NameSpace)){
    window.g_app.model(model);
}

function *loadData(name,page,params,put,call) {
    yield put({
        type:'_update',
        payload:{
            name,
            loading:true,
            error:undefined,
        }
    });
    const callbacks = CallbackMap[name] || {};
    try{
        const fetch = SourceActionMap[name];
        const result = yield call(fetch,{
            page_num:page.current,
            page_size:page.pageSize,
            ...params
        });
        page.total = result.total;
        page.data = result.data;
        if(callbacks.onDataLoaded)callbacks.onDataLoaded(page,params);
        yield put({
            type:'_update',
            payload:{
                name,
                page
            }
        });
    }catch (e) {
        yield put({
            type:'error',
            payload:{
                name,
                error:e
            }
        });
        if(callbacks.onError)callbacks.onError(e);
        // throw e;
    }finally {
        yield put({
            type:'loading',
            payload:{
                name,
                isLoading:false
            }
        });
    }
    return page;
}

function check(name,state) {
    if(typeof name !== 'string') throw new TypeError('Argument [name] must be a string,But got a '+name);
    if(!state.page[name])throw new Error(name+' is not fount,May not be initialized or has been destroyed!');
}
