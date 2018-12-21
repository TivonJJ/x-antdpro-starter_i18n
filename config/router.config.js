export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            // { path: '/user', redirect: '/user/login' },
            { path: '/user/login', component: './User/Login', title: 'Route.login' },
            {
                Routes: ['src/router-interceptor/authorized/Sign'],
                routes:[
                    { path: '/user/changePassword', component: './User/ChangePassword', title: 'Route.changePassword' },
                ]
            }
        ],
    },
    {
        path: '/exception',
        component: '../layouts/BlankLayout',
        routes: [
            { path: '/exception/404', component: '/Exception/404' },
            { path: '/exception/403', component: '/Exception/403' },
            { path: '/exception/500', component: '/Exception/500' },
        ]
    },
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/router-interceptor/authorized/Sign','src/router-interceptor/authorized/Role'],
        routes: [
            {
                path: '/demo',
                routes:[
                    {
                        path:'/demo/chart',
                        component: './Demo/Chart'
                    },
                    {
                        path: '/demo/list',
                        component: './Demo/List',
                        routes:[
                            {
                                path:'/demo/list/new',
                                component: './Demo/List/New',
                            },
                            {
                                path:'/demo/list/:id',
                                component: './Demo/List/Detail',
                            }
                        ]
                    },
                ],
            },
            {
                path:'/sys',
                routes:[
                    {
                        path: '/sys/permissions/users',
                        component: './System/Users',
                    },
                    {
                        path: '/sys/permissions/roles',
                        component: './System/Roles',
                    },
                    {
                        path: '/sys/permissions/resource',
                        component: './System/Permissions',
                    },
                    {
                        path: '/sys/logs',
                        component: './System/Logs',
                    },
                ]
            },
        ],
    },
    {component: '404'}
];
