import React from 'react';
import E403 from '@/pages/Exception/403';
import E404 from '@/pages/Exception/404';
import {getRouteByLink} from "@/utils";
import {checkUserAuth} from "@/components/Authorized";

export default ({ children, route, location }) => {
    if(!location.pathname || location.pathname === '/')return children;
    if(!getRouteByLink(route.routes,location.pathname)){
        return <E404/>
    }
    if(!checkUserAuth(location.pathname)){
        return <E403/>
    }
    return children;
};
