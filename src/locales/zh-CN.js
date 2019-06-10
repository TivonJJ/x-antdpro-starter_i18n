import app from './zh-CN/app';
import route from './zh-CN/route';
import validator from './zh-CN/validator';
import common from './zh-CN/common';
import component from './zh-CN/component';
import modeDemo from './zh-CN/models/demo';
import modePermissions from './zh-CN/models/permissions';
import modeSystem from './zh-CN/models/system';
import modeTask from './zh-CN/models/task';
import pageChangePassword from './zh-CN/pages/changePassword';
import pageDemo from './zh-CN/pages/demo';
import pageException from './zh-CN/pages/exception';
import pageLogin from './zh-CN/pages/login';
import pageSystem from './zh-CN/pages/system';

export default {
    ...app,
    ...route,
    ...validator,
    ...common,
    ...component,
    ...modeDemo,
    ...modePermissions,
    ...modeSystem,
    ...modeTask,
    ...pageChangePassword,
    ...pageDemo,
    ...pageException,
    ...pageLogin,
    ...pageSystem,
};
