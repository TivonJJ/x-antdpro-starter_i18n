import React from 'react';
import { formatMessage } from 'umi/locale';
import E403 from '@/pages/Exception/403';
import E404 from '@/pages/Exception/404';
import checkPermissions from '@/components/Authorized/CheckPermissions';
import {getRouteByLink} from "@/utils";

export default ({ children,match, route, location }) => {
    if(!location.pathname || location.pathname === '/')return children;
    if(!getRouteByLink(route.routes,location.pathname)){
        return <E404/>
    }
    if(!checkPermissions(location.pathname)){
        return <E403/>
    }
    return children;
};
