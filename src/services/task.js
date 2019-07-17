import request from '../utils/request';

export async function fetchTasks(params){
    return request.post('task/list',params);
}

