"use strict";
import {fetchUsers,fetchRoles,resetUserPassword,updateUserStatus,deleteUser,upsertUser} from '@/services/system';
import {createNormalPagination} from "@/utils";

export default {
    namespace:'userManage',

    state:{
        users:[],
        pagination: createNormalPagination(),
        roles:[]
    },
    effects:{
        *fetch({payload}, {call, put, select}){
            const state = yield select(state => state.userManage);
            const {pagination} = state;
            const params = Object.assign(payload.params, {page_size: pagination.pageSize, page_num: pagination.current});
            const response = yield call(fetchUsers, params);
            yield put({
                type: 'changePagination',
                payload: {
                    pagination: {
                        total: response.total
                    }
                }
            });
            yield put({
                type: 'changeUsers',
                payload: {
                    users: response.data,
                    pagination: {
                        total: response.total
                    }
                }
            })
        },
        *fetchRoles({payload}, {call, put, select}){
            const state = yield select(state => state.userManage);
            const {roles} = state;
            if (roles && roles.length > 0) return roles;
            const response = yield call(fetchRoles, payload.params);
            yield put({
                type: 'changeRoles',
                payload: {
                    roles: response.data
                }
            })
        },
        *resetUserPassword({payload}, {call}){
            yield call(resetUserPassword,payload.userId);
        },
        *setUserStatus({payload},{call,put,select}){
            yield call(updateUserStatus, payload.params);
            const state = yield select(state => state.userManage);
            state.users.map((item) => {
                if (item.user_id === payload.params.user_id) {
                    item.status = payload.params.status;
                }
            });
            yield put({
                type: 'changeUsers',
                payload: {
                    users: state.users
                }
            })
        },
        *deleteUser({payload},{call}){
            yield call(deleteUser,payload);
        },
        *upsertUser({payload},{call}){
            return yield call(upsertUser,payload.values);
        }
    },
    reducers:{
        changePagination(state, {payload}){
            return {
                ...state,
                pagination:Object.assign(state.pagination,payload.pagination)
            }
        },
        changeUsers(state, {payload}){
            return {
                ...state,
                users:payload.users
            }
        },
        changeRoles(state, {payload}){
            return {
                ...state,
                roles:payload.roles
            }
        }
    }
}
