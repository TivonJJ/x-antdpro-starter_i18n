import React from 'react';
import { formatMessage } from 'umi/locale';
import checkPermissions from '@/components/Authorized/CheckPermissions';
import Redirect from 'umi/redirect';

export default ({ children, route, location }) => {
    if(!checkPermissions(location.pathname,true)){
        const loginPath = '/user/login';
        const ignorePath = [loginPath,'/'];
        const query = ignorePath.indexOf(location.pathname)!==-1?{}:{r:location.pathname};
        return <Redirect to={{pathname:loginPath,query}}/>
    }
    return children;
};
