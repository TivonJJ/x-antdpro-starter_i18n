import React from 'react';
import PropTypes from 'prop-types';
import CheckPermissions from './CheckPermissions';
import pathToRegexp from 'path-to-regexp';

//缓存的权限信息
let Authority = null;

export const setAuthority = (authority)=> {
    let auth = authority;
    if(authority){
        auth = {};
        Object.keys(authority).map(key=>{
            const item = authority[key];
            if(item.status == 1){
                if(item.route)item.pathRegexp=pathToRegexp(item.route);
                auth[key] = item;
            }
        })
    }
    Authority = auth;
};

export const getAuthority = ()=>{
    return Authority;
};

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
        return CheckPermissions(route,onlyCheckSign)?childrenRender:noMatch;
    }
}

export default Authorized;
