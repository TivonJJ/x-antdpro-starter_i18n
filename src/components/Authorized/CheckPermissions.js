import React from 'react';
import {getAuthority} from './index';

// 根据路由来判断当前用户是否有权限访问
const checkPermissions = (route, onlyCheckSign) => {
    // 没有权限.跳转异常
    const authority = getAuthority();
    if(!authority)return false;
    if(onlyCheckSign===true && authority)return true;
    // 有权限
    if(typeof route === 'string'){
        if(!route || route === '/')return true;
        return Object.values(authority).some(({pathRegexp})=>{
            if(!pathRegexp)return false;
            return pathRegexp.test(route)
        });
    }
    // Function 处理
    if (typeof route === 'function') {
        return route(authority);
    }
    return false;
};

export default checkPermissions;
