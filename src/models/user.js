import {login, modifyPassword} from '../services/user';
import { md5 } from '@/utils';
import router from 'umi/router';
import Cookies from 'js-cookie';
import pathToRegexp from 'path-to-regexp';

// 用户存储cookie区域， 用户实际信息存储在localStorage内，在cookie内保存一个key来对应storage里面的内容
class UserCookieStore{
    storePrefix='';
    userMarkPrefix='@user_';
    Storage=localStorage;
    cookieKey='user-key';
    constructor(storePrefix){
        this.storePrefix = storePrefix;
    }
    set(data){
        this.clear();
        if(!data)return;
        const storeKey = this.getRealKey() + Date.now();
        this.Storage.setItem(storeKey, window.JSON.stringify(data));
        Cookies.set(this.cookieKey,storeKey,{path:'/'});
    }
    get(){
        const storeKey = Cookies.get(this.cookieKey);
        if(!storeKey)return null;
        let user = this.Storage.getItem(storeKey);
        if (!user)return null;
        return window.JSON.parse(user);
    }
    getRealKey(){
        return this.storePrefix + this.userMarkPrefix;
    }
    clear(){
        const regx = new RegExp('^('+this.getRealKey()+')');
        for(let i=0;i<this.Storage.length;i++){
            const key = this.Storage.key(i);
            if(regx.test(key)){
                this.Storage.removeItem(key);
            }
        }
    }
}
const userCookieStore = new UserCookieStore('x-starter');
const localUser = getUserFromStore();

export default {
    namespace: 'user',
    state: {
        currentUser:localUser
    },
    effects: {
        * login({payload}, {call, put}) {
            payload.password = SignPassword(payload.username,payload.password);
            const response = yield call(login, payload);
            const AuthUser = extUserAuthMap(response);
            yield put({
                type: 'changeStatus',
                payload: {
                    currentUser:AuthUser
                }
            });
            return AuthUser;
        },
        * logout({payload}, {put}) {
            yield put({
                type: 'changeStatus',
                payload: {
                    currentUser: null
                }
            });
            let query = {};
            if(payload && payload.takeRouteInfo){
                query.r = window.location.href;
            }
            router.push({
                pathname:'/user/login',
                query
            });
        },
        *modifyPassword({payload}, {call}){
            const params = payload.params;
            params.old_password = SignPassword(params.username,params.password);
            params.new_password = SignPassword(params.username,params.new_password);
            yield call(modifyPassword,params);
        },
    },

    reducers: {
        changeStatus(state,{payload}){
            if('currentUser' in payload)storeUser(payload.currentUser);
            return {
                ...state,
                ...payload
            }
        }
    },
};

export const SignPassword = (username, password)=>{
    return md5(username + password);
};

function storeUser(user) {
    console.log('store-user',user);
    if(user){
        user = {...user};
        delete user.routeMap;
        delete user.dnaMap;
        userCookieStore.set(user);
    }else {
        userCookieStore.clear();
    }
}

function getUserFromStore() {
    const user = userCookieStore.get();
    if(!user)return null;
    return extUserAuthMap(user);
}

function extUserAuthMap(user) {
    const routeMap = {},
        dnaMap = {};
    const menus = user.menus || [];
    walkMenu(menus);

    function walkMenu(menus){
        menus.map(menu=>{
            routeMap[menu.route] = menu;
            dnaMap[menu.dna] = menu;
            menu.pathRegexp=pathToRegexp(menu.route);
            if(menu.children){
                walkMenu(menu.children);
            }
        })
    }
    user.routeMap = routeMap;
    user.dnaMap = dnaMap;
    return user;
}
