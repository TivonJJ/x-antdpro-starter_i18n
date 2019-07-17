import request from '../utils/request';
import {PermissionsUtil,removeEmptyProperty} from "../utils";

function decoratePermission(list=[]) {
    const existsPermissionsID = [];
    list.forEach(item=>{
        if(item.res_name && typeof item.res_name==='string'){
            try{
                item.res_name = JSON.parse(item.res_name);
            }catch (e) {
                console.error('Invalid i18n name',item.res_name);
                item.res_name = {};
            }
        }
        existsPermissionsID.push(item.id);
    });
    const tree = PermissionsUtil.structureByDNA(list);
    console.log(tree);
    return {tree,existsPermissionsID};
}
function mapPermissions(list=[]){
    const IDMap = {};
    const DNAMap = {};
    list.forEach(item=>{
        IDMap[String(item.res_id)] = item;
        DNAMap[item.dna] = item;
    });
    const permissions = PermissionsUtil.structureByDNA(list);
    return {
        permissions,
        permissionsIDMap:IDMap,
        permissionsDNAMap:DNAMap
    }
}
export async function getPermissions(params) {
    return request.post('resource/list',params).then(res=>decoratePermission(res.data))
}
export async function savePermissions(data) {
    return request.post('resource/addOrUpdate',data)
}
export async function getRoles(params){
    return  request.post('role/list', params);
}
export async function updateRole(params){
    return request.post('basis/role/update',params)
}
export async function updateRoleStatus(params){
    return request.post('basis/role/updateStatus',params)
}
export async function addRole(role){
    return request.post('basis/role/add',role)
}
export async function getPermissionsMap(){
    return request.post('basis/resource/list').then(res=>(mapPermissions(res.data)))
}
export async function getPermissionsByRoleId(roleId){
    return request.post('basis/role/detail', { role_id:roleId }).then(res => res.data);
}
export async function getUsers(params) {
    return request.post('user/list',removeEmptyProperty(params));
}
export async function getUserByRole(roleId){
    return request.post('basis/role/roleUserList',{roleId}).then(res=>res.data[0])
}
export async function setUserToRole(data){
    return request.post('basis/role/allocRole',data)
}
export async function deleteRole(id){
    return request.post('basis/role/delete',{role_id:id})
}
export async function resetUserPassword(userId) {
    return request.post('basis/user/resetPassword',{user_id:userId});
}

export async function updateUserStatus(params) {
    return request.post('basis/user/update',params);
}

export async function deleteUser(params) {
    return request.post('basis/user/delete',params);
}

export async function upsertUser(user) {
    const uri = user.user_id?'basis/user/update':'basis/user/add';
    return request.post(uri,user);
}
