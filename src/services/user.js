import request from '../utils/request';
import {PermissionsUtil,joinPath} from '../utils';
import { getPublicPath } from '@/utils';

export async function login(params) {
    return request.post('user/login', params).then(res=>decorateUserInfo(res.data[0]));
}

export async function modifyPassword(params) {
    return request.post('user/modifyPassword',params);
}

function decorateUserInfo(data) {
    const userInfo = data;
    userInfo.avatar = getPublicPath('/img/avatar.png');
    const menus = PermissionsUtil.structureByDNA(data['user_res_list']);
    _initMenus(menus);
    userInfo.menus = menus;
    return userInfo;
}

function _initMenus(menus,parent) {
    for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        // if(menu.status === 2)continue;
        extendAttributes(menu);
        if (menu.children) {
            _initMenus(menu.children, menu);
        }
    }

    function extendAttributes(menu) {
        if(typeof menu.res_name==='string'){
            try{
                menu.title = JSON.parse(menu.res_name);
            }catch (e) {
                console.error('Invalid menu name',menu.res_name);
                menu.title = {};
            }
        }else {
            menu.title = menu.res_name;
        }
        menu.isDir = menu.res_type === "Folder";
        menu.isMenu = menu.res_type === "Menu";
        menu.isAction = menu.res_type === "Action";
        menu.isStatusBar = menu.res_type === "StatusBar";
        menu.route = parent?joinPath('/',parent.route,menu.res_url):joinPath('/',menu.res_url);
        menu.icon = menu.icon_url;
        menu.res_id = menu.id || Date.now();
    }
}
