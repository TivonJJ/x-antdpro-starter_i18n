import request from '../utils/request';

export async function getList(params){
    return request.post('demo/list',params);
}

export async function getDetail(no) {
    return request.post('demo/detail',{no}).then(res=>res.data[0]);
}

export async function insert(params) {
    return request.post('demo/insert',params);
}

export async function update(params) {
    return request.post('demo/update',params);
}
