"use strict";
import request from '../utils/request';

export const fetchTasks = (params)=>{
    return request.post('task/list',params);
};

