import React from 'react';
import PropTypes from 'prop-types';

function getCurrentUser() {
    const user = window.g_app._store.getState().user;
    return user && user.currentUser;
}

export function checkUserLogged() {
    const user = getCurrentUser();
    return !!user;
}

export function checkUserAuth(route){
    // 没有权限.跳转异常
    const user = getCurrentUser();
    if(!user)return false;
    const authedRoutes = user.routeMap;
    if(!authedRoutes)return false;
    // 有权限
    if(typeof route === 'string'){
        if(!route || route === '/')return true;
        return Object.values(authedRoutes).some(({pathRegexp})=>{
            if(!pathRegexp)return false;
            return pathRegexp.test(route)
        });
    }
    // Function 处理
    if (typeof route === 'function') {
        return route(authedRoutes);
    }
    return false;
}

class Authorized extends React.Component {
    static propTypes = {
        onlyCheckSign:PropTypes.bool,
        route:PropTypes.any.isRequired,
        children:PropTypes.any,
        noMatch:PropTypes.any
    };
    render() {
        const {children, noMatch = null, route, onlyCheckSign} = this.props;
        const childrenRender = typeof children === 'undefined' ? null : children;
        return checkUserAuth(route,onlyCheckSign)?childrenRender:noMatch;
    }
}

export default Authorized;
