import {login, modifyPassword} from '../services/user';
import {setAuthority} from '@/components/Authorized';
import { md5 } from '@/utils';
import router from 'umi/router';

const localUser = getUserFromStore();
if(localUser)setAuthority(localUser.routeMap);

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
            setAuthority(AuthUser.routeMap);
            yield put({
                type: 'changeStatus',
                payload: {
                    currentUser:AuthUser
                }
            });
            return AuthUser;
        },
        * logout(_, {put}) {
            yield put({
                type: 'changeStatus',
                payload: {
                    currentUser: null
                }
            });
            setAuthority(null);
            router.push('/user/login');
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
        if (typeof user === 'object') user = JSON.stringify(user);
        sessionStorage.setItem('user', user);
    }else {
        sessionStorage.removeItem('user');
    }
}

function getUserFromStore() {
    const user = sessionStorage.getItem('user');
    if(!user)return null;
    return extUserAuthMap(JSON.parse(user));
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
            if(menu.children){
                walkMenu(menu.children);
            }
        })
    }
    user.routeMap = routeMap;
    user.dnaMap = dnaMap;
    return user;
}
