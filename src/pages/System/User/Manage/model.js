import { getRoles, updateUserStatus, deleteUser, upsertUser, resetUserPassword } from '@/services/system';

function getInitalState() {
    return {
        roles:[]
    }
}
export default {
    namespace:'userManage',
    state: getInitalState(),
    effects:{
        *fetchRoles({payload}, {call, put, select}){
            const state = yield select(allState => allState.userManage);
            const {roles} = state;
            if (roles && roles.length > 0) return roles;
            const response = yield call(getRoles, payload.params);
            yield put({
                type: 'changeRoles',
                payload: {
                    roles: response.data
                }
            });
            return response.data;
        },
        *resetUserPassword({payload}, {call}){
            return yield call(resetUserPassword,payload.userId);
        },
        *setUserStatus({payload},{call}){
            return yield call(updateUserStatus, payload.params);
        },
        *deleteUser({payload},{call}){
            return yield call(deleteUser,payload);
        },
        *upsertUser({payload},{call}){
            return yield call(upsertUser,payload.values);
        }
    },
    reducers:{
        changeRoles(state, {payload}){
            return {
                ...state,
                roles:payload.roles
            }
        },
        reset(){
            return getInitalState()
        }
    }
}
