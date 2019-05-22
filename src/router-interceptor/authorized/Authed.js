import React from 'react';
import { formatMessage } from 'umi/locale';
import E403 from '@/pages/Exception/403';
// import E404 from '@/pages/Exception/404';
import {getRouteByLink} from "@/utils";
import {checkUserAuth} from "@/components/Authorized";

export default ({ children,match, route, location }) => {
    if(!location.pathname || location.pathname === '/')return children;
    if(!getRouteByLink(route.routes,location.pathname)){
        return children
    }
    if(!checkUserAuth(location.pathname)){
        return <E403/>
    }
    return children;
};
