'use strict';
const Menus = require('./menu.json');
const fs = require('fs');

export const mockUser = {
    'code': '0',
    'data': [{
        'password': 'A66ABB5684C45962D887564F08346E8D',
        'is_deleted': 0,
        'user_id': 8,
        'role_id': null,
        'user_res_list': Menus,
        'real_name': 'admin',
        'username': 'admin',
        'status': 0,
    }],
    'msg': '成功',
    'psn': '08221513038066496990',
    'total': 1,
};
export const mockUserList = {
  'code': '0',
  'data': [{
    'username': 'yecuihao@chinafintech.cn',
    'role_id': 100019,
    'status': 1,
    'real_name': 'Cui Hao Ye',
    'create_time': '2018-05-18 09:36:21',
    'user_id': 100027,
    'role_name': 'development',
    'tel_phone': '15680461056',
  }, {
    'username': 'wentingting@chinafintech.cn',
    'role_id': 100019,
    'status': 1,
    'real_name': 'Ting Ting',
    'create_time': '2018-05-18 09:30:06',
    'user_id': 100026,
    'role_name': 'development',
    'tel_phone': '13709022973',
  }, {
    'username': 'huke@chinafintech.cn',
    'role_id': 100019,
    'status': 2,
    'real_name': 'huke',
    'create_time': '2018-05-16 13:45:23',
    'user_id': 100025,
    'role_name': 'development',
    'tel_phone': '18682752475',
  }, {
    'username': 'qinglin@chinafintech.cn',
    'role_id': 100019,
    'status': 1,
    'real_name': '青林',
    'create_time': '2018-05-16 13:00:39',
    'user_id': 100024,
    'role_name': 'development',
    'tel_phone': '18380336772',
  }, {
    'username': 'luozhenyu@wangpos.com',
    'role_id': 100019,
    'status': 1,
    'real_name': '罗振宇',
    'create_time': '2018-04-26 20:16:25',
    'user_id': 100023,
    'role_name': 'development',
    'tel_phone': '13980995624',
  }, {
    'username': 'yangjun@wangpos.com',
    'role_id': 100019,
    'status': 1,
    'real_name': '杨俊',
    'create_time': '2017-07-31 12:23:17',
    'user_id': 100005,
    'role_name': 'development',
    'tel_phone': '13618008806',
  }, {
    'username': 'liqie@wangpos.com',
    'role_id': 100019,
    'status': 1,
    'real_name': '李小红',
    'create_time': '2018-04-25 15:49:46',
    'user_id': 100022,
    'role_name': 'development',
    'tel_phone': '15002875942',
  }, {
    'username': 'sys@wangpos.com',
    'role_id': '',
    'status': 1,
    'real_name': 'system',
    'create_time': '2018-04-27 09:51:27',
    'user_id': 2,
    'role_name': '',
    'tel_phone': '11111111111',
  }],
  'info': '操作成功。',
  'msg': '操作成功。',
  'psn': '05240938501762811600',
  'status': 0,
  'total': 8,
}
export const mockRoleList = {
    'code': '0',
    'data': [{
        'role_user_count': 7,
        'role_id': 100019,
        'status': 1,
        'description': '调试用的',
        'role_name': '开发调试',
    }, {
        'role_user_count': 0,
        'role_id': 100016,
        'status': 0,
        'description': '商户角色',
        'role_name': '商户',
    }, { 'role_user_count': 0, 'role_id': 100015, 'status': 1, 'description': '门店员工', 'role_name': '门店员工' }],
    'info': '操作成功。',
    'msg': '操作成功。',
    'psn': '05240941564193180410',
    'status': 0,
    'total': 3,
}
export const mockResource = {
    'code': '0',
    'data': Menus,
    'info': '操作成功。',
    'msg': '操作成功。',
    'psn': '05240956491217863944',
    'status': 0,
    'total': 35,
}
export const mockResByRole = {
    'code': '0',
    'data': Menus.filter(item=>['操作日志','权限资源管理'].indexOf(item.res_name)===-1),
    'info': '操作成功。',
    'msg': '操作成功。',
    'psn': '05240958361147681540',
    'status': 0,
    'total': 29,
}

export default {
    'POST /api/user/login': (req,res)=>{
        const body = req.body;
        if(body.username === 'admin' && body.password==="a66abb5684c45962d887564f08346e8d"){
            res.send(mockUser);
        }else {
            res.send({"code":"EB3019","data":[],"info":"用户名或密码错误","msg":"用户名或密码错误","psn":"05181013091106903591","status":-99,"total":0})
        }
    },
    'POST /api/user/list':(req,res)=>{
        if('status' in req.body){
            const list = mockUserList.data.filter(item=>item.status==req.body.status);
            res.send({
                ...mockUserList,
                data:list
            });
        }else {
            res.send(mockUserList)
        }
    },
    'POST /api/role/list':(req,res)=>{
        if(req.body.status){
            const list = mockRoleList.data.filter(item=>item.status==req.body.status);
            res.send({
                ...mockRoleList,
                data:list
            });
        }else {
            res.send(mockRoleList)
        }
    },
    'POST /api/resource/list':mockResource,
    'POST /api/role/getResbyRoleId':mockResByRole,
    'POST /api/resource/addOrUpdate':(req,res)=>{
        const list = req.body.res_list;
        fs.writeFile(require('path').join(__dirname,'menu.json'),
            JSON.stringify(list), (err)=> {
                if (err) {
                    res.send({"code":"EB3119","data":[],"info":"菜单写入失败","msg":"菜单写入失败","psn":"05181013091106902591","status":-99,"total":0})
                }else {
                    res.send({code:0,data:[],msg:'操作成功'});
                }
            });
    },
}
