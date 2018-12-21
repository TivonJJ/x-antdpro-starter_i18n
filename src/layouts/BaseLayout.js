'use strict';
import React from 'react';
import {formatMessage,getLocale} from 'umi/locale';
import pathToRegexp from 'path-to-regexp';

export default class BaseLayout extends React.PureComponent{
    getPageTitle() {
        const {route: { routes }, location,currentUser} = this.props;
        const {pathname} = location;
        const appName = formatMessage({id:'App.appName'});
        let title = appName;
        let before = '';
        switch (window.appMeta.env) {
            case 'test':
                before = formatMessage({id:'App.envTestMark'})+' ';
                break;
            case 'uat':
                before = formatMessage({id:'App.envUATMark'})+' ';
                break;
        }
        const getTitle = ()=>{
            if(currentUser&&currentUser.routeMap){
                const menu = currentUser.routeMap[pathname];
                if(menu && menu.title){
                    return menu.title[getLocale()];
                }
            }
            if(routes){
                const findRoute = ()=>{
                    let route = null;
                    _find(routes);
                    return route;
                    function _find(data=[]){
                        for(let i=0;i<data.length;i++){
                            const path = data[i].path;
                            if(path&&pathToRegexp(path).test(pathname)){
                                route = data[i];
                                break;
                            }
                            _find(data[i].routes);
                        }
                    }
                };
                const router = findRoute();
                if(router && router.title)return formatMessage({id:router.title});
            }
        };
        const t = getTitle();
        if(t)title = `${t} - ${appName}`;
        return before + title;
    }
}
