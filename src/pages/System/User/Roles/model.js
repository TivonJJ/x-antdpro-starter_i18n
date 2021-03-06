import {
    addRole,
    deleteRole, getRoles,
    getPermissionsByRoleId,
    getPermissionsMap,
    updateRole, updateRoleStatus,
} from '@/services/system';

function getInitalState() {
    return {
        status : undefined,
        busy : false,
        roles : [],
        selectedPermission : null,
        modalBusy : false,
        permissions : null,
        permissionsIDMap : {},
        permissionsDNAMap : {},
    }
}

export default {
    namespace : 'role',
    state : getInitalState(),
    effects : {
        * fetch({ payload }, { call, put}){
            const result = yield call(getRoles, payload);
            let status = null;
            if(payload){
                status = payload.status;
            }
            yield put({type : 'changeRoleState',payload:{roles:result.data,status}});
        },
        * fetchPermissions(_, { call, put }){
            const result = yield call(getPermissionsMap);
            yield put({type : 'changeRoleState',payload : result});
        },
        * fetchPermissionsByRoleId({ payload }, { call }){
            return yield call(getPermissionsByRoleId,payload);
        },
        * setStatus({ payload }, { put, call }){
            yield call(updateRoleStatus, payload);
            yield put({ type : 'fetch'});
        },
        * updateRole({ payload }, { call, put }){
            yield call(updateRole, payload);
            yield put({ type : 'fetch'});
        },
        * addRole({ payload }, { call, put }){
            yield call(addRole, payload);
            yield put({ type : 'fetch'});
        },
        * deleteRole({ payload }, { call, put }){
            yield call(deleteRole, payload.role_id);
            yield  put({ type : 'fetch' });
        }
    },
    reducers : {
        changeRoleState(state, { payload }){
            return {
                ...state,
                ...payload,
            }
        },
        reset(){
            return getInitalState()
        }
    }
}
