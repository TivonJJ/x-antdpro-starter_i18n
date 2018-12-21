"use strict";
/**
 *  系统功能
 */
export const SYSTEM_USER_ADD ="/sys/permissions/users/add";
export const SYSTEM_USER_UPDATE ="/sys/permissions/users/update";
export const SYSTEM_USER_RESET_PWD ="/sys/permissions/users/resetPwd";
export const SYSTEM_USER_STATUS ="/sys/permissions/users/status";
export const SYSTEM_USER_DELETE ="/sys/permissions/users/delete";
export const SYSTEM_ROLE_ADD="/sys/permissions/roles/add";
export const SYSTEM_ROLE_UPDATE="/sys/permissions/roles/update";
export const SYSTEM_ROLE_DISTRIBUTION="/sys/permissions/roles/distribution";
export const SYSTEM_ROLE_DELETE="/sys/permissions/roles/delete";

/** 商户 */
export const MERCHANT_QUERY_EXPORT='/merchant/manage/query/export/only_export'
export const MERCHANT_QUALIFICATION_CERT='/merchant/manage/audit/:id/cert'
/** 门店 */

/**
 *  设备管理 -> 设备预录入
 */
export const DEVICE_MANAGMENT_IMPORT ='/device/management/equipmentEntry/import';
export const DEVICE_MANAGMENT_BATCH_DETAILS ='/device/management/equipmentEntry/batchDetails';
/**
 *  设备管理 -> 设备列表
 */ 
export const DEVICE_MANAGMENT_CHANGE_GROUP ='/device/management/list/change';
export const DEVICE_MANAGMENT_OPERATION ='/device/management/list/operation';
export const DEVICE_MANAGMENT_DEVICE_DETAILS ='/device/management/list/details';
/**
 *  设备管理 -> 分组管理
 */ 
export const DEVICE_MANAGMENT_GROUP_ADD_DEVICE ='/device/management/group/operation/:id';
export const DEVICE_MANAGMENT_GROUP_DETAILS ='/device/management/group/detail/:id';
export const DEVICE_MANAGMENT_GROUP_ADD ='/device/management/group/add';
/**
 *  应用管理 -> 应用列表
 */ 
export const DEVICE_APPMANAGMENT_LIST_BATCHPUSH ='/device/appManagement/appList/batchPush';
export const DEVICE_APPMANAGMENT_LIST_ADDAPP ='/device/appManagement/appList/addApp';
export const DEVICE_APPMANAGMENT_LIST_PUSH ='/device/appManagement/appList/push/:id';
export const DEVICE_APPMANAGMENT_LIST_MODIFY ='/device/appManagement/appList/modify';
export const DEVICE_APPMANAGMENT_LIST_PUSH_DETAIL ='/device/appManagement/appList/details/:id';
export const DEVICE_APPMANAGMENT_LIST_APP_DETAIL ='/device/appManagement/appList/appDetails/:id';
/**
 *  应用管理 -> 推送记录
 */ 
export const DEVICE_APPMANAGMENT_RECORD_DETAIL ='/device/appManagement/record/details/:id';
/**
 *  OTA管理 -> 列表
 */ 
export const DEVICE_OTAMANAGMENT_LIST_ADD ='/device/ota/list/add';
export const DEVICE_OTAMANAGMENT_LIST_PUSH ='/device/ota/list/push/:id';
export const DEVICE_OTAMANAGMENT_LIST_Modify ='/device/ota/list/modify';
export const DEVICE_OTAMANAGMENT_LIST_PUSH_DETAILS ='/device/ota/list/details/:id';
/**
 *  界面定制管理 -> 界面定制 -> 列表
 */ 
export const DEVICE_INTERFACEMANAGEMENT_LIST_ADD = '/device/interfaceManagement/managementList/add';
export const DEVICE_INTERFACEMANAGEMENT_LIST_MODIFY = '/device/interfaceManagement/managementList/modify/:id'
export const DEVICE_INTERFACEMANAGEMENT_LIST_LOOK = '/device/interfaceManagement/managementList/look/:id'
export const DEVICE_INTERFACEMANAGEMENT_LIST_DETAILS = '/device/interfaceManagement/managementList/details/:id'
export const DEVICE_INTERFACEMANAGEMENT_LIST_PUSH = '/device/interfaceManagement/managementList/push/:id'
/**
 *  界面定制管理 -> 推送记录 -> 列表
 */ 
export const DEVICE_INTERFACERECORD_LIST_DETAILS = '/device/interfaceManagement/record/details/:id'
