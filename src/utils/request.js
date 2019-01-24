import axios from 'axios';
import { joinPath } from '@/utils/index';
import {getLocale} from 'umi/locale';
const baseURL = '/api';

function createDefaultRequest() {
    const instance = axios.create({
        baseURL,
        timeout: 1000*30,
    });
    instance.interceptors.request.use(config=>{
        config.headers['Accept-Language'] = getLocale();
        return config;
    });
    instance.interceptors.response.use(response=>{
        const data = response.data;
        
        if(data && data.code != 0){
            if(data.code === 'SYS010'){//未登录或登录超时
                window.g_app._store.dispatch({
                    type: 'user/logout',
                });
            }
            const error = {
                code:data.code,
                message:data.msg,
                response,
                type:'NetError'
            };
            return Promise.reject(error);
        }
        return data;
    },(r)=>{
        if(r instanceof Error){
            return Promise.reject({
                code:r.code,
                message:r.message,
                type:'NetError'
            });
        }
        const response = r.response;
        const status = response.status;
        const error = {
            message:`[${status}]${response.statusText}`,
            code:status,
            response,
            type:'NetError'
        };
        return Promise.reject(error);
    });
    instance.getAbsUrl = function(url) {
        return joinPath(baseURL,url)
    };
    return instance;
}

export default createDefaultRequest();
