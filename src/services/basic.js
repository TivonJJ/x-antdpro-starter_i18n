'use strict';
import request from '../utils/request';

export async function fetchDemoDataList(params) {
    return request.post('demo/selectData/list',params)
}

export async function resetPassword(params) {
    return request.post('basis/employees/resetPassword',params)
}

export async function getLogs(params) {
    return request.post('basis/oplog/list',params);
}
