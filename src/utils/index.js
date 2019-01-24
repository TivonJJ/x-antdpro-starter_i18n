'use strict';
import { matchRoutes } from 'react-router-config';

const cloneDeep = require('safe-clone-deep');
const crypto = require('crypto');
import moment from 'moment-timezone';
import pathJoin from 'join-path';

const URL_REG = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
    return URL_REG.test(path);
}


export function unique(arr) {
    arr.sort(); //先排序
    let res = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== res[res.length - 1]) {
            res.push(arr[i]);
        }
    }
    return res;
}

export function getRouteByLink(routes, routeLink) {
    const matches = matchRoutes(routes, routeLink);
    const lastRoute = matches[matches.length - 1];
    if (!lastRoute || !lastRoute.match.isExact) return null;
    return lastRoute;
}

/**
 * 移除对象中的无效键和空串键，常用语表单数据请求接口时处理，空串对接口来说是有效的
 * @param obj
 * @param options
 * @returns {*}
 */
export const removeEmptyProperty = (obj, options = {}) => {
    for (let key in obj) {
        let val = obj[key];
        if (options.ignores && options.ignores.indexOf(key) !== -1) continue;
        if (options.trim !==false && typeof val==='string'){
            val = val.trim();
        }
        if (null == val || '' === val) delete obj[key];
    }
    return obj;
};

export const md5 = (str, digestType = 'hex') => {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest(digestType);
};
/**
 * 移除对象中的属性
 * @param obj
 * @param props
 */
export const removeProperties = (obj, props) => {
    if (Array.isArray(props)) {
        props.map(key => {
            obj[key] = undefined;
            delete obj[key];
        });
    } else {
        obj[props] = undefined;
        delete obj[props];
    }
};
// 权限数据处理工具
export const PermissionsUtil = {
    structureByDNA(tileData) {
        if (!tileData) return [];
        const tree = { children: [] };
        tileData.map(item => {
            initDNA(item);
            insertWithDNA(item);
        });
        return removeInvalid(tree.children);


        function initDNA(item) {
            const DNA = item.dna || '0';
            const chain = DNA.split('-');
            item.$dna = [];
            chain.forEach(key => {
                item.$dna.push(parseInt(key));
            });
        }


        function insertWithDNA(item) {
            let cursor = tree;
            item.$dna.forEach((key) => {
                key = parseInt(key);
                if (!cursor.children) cursor.children = [];
                if (!cursor.children[key]) cursor.children[key] = {};
                cursor = cursor.children[key];
            });
            Object.assign(cursor, item);
        }


        function removeInvalid(permissions) {
            const realList = [];
            loop(realList, permissions);
            return realList;


            function loop(wrapper, list) {
                for (let i = 0; i < list.length; i++) {
                    const item = list[i];
                    if (!item) continue;
                    const children = item.children;
                    delete item.children;
                    if (item.dna) {
                        wrapper.push(item);
                    }
                    if (children) {
                        loop(item.children = [], children);
                    }
                }
            }
        }
    },
    recombineDNA(tree, onItem) {
        this.loopTree(tree, (item, index, arr, parent) => {
            item.sort_num = index;
            const dna = parent ? parent.dna.split('-') : [];
            dna.push(index);
            item.$dna = dna;
            item.dna = dna.join('-');
            onItem && onItem(item, index, arr, parent);
        });
        return tree;
    },
    toTile(tree) {
        const list = [];
        this.loopTree(this.recombineDNA(tree), (item) => {
            item = Object.assign({}, item);
            delete item.children;
            delete item.$dna;
            list.push(item);
        });
        return list;
    },
    loopTree(tree, callback) {
        loop(tree);


        function loop(data, parent) {
            data.map((item, index, arr) => {
                callback(item, index, arr, parent);
                if (item.children) {
                    return loop(item.children, item);
                }
            });
        }
    },
};

export const isPromise = function(obj) {
    return (
        !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function'
    );
};


// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
export function urlToList(url) {
    const urllist = url.split('/').filter(i => i);
    return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
}

export const joinPath = pathJoin;

// 获取public实际地址，如果部署在二级目录该方法会返回public里面文件的真实URL
export function getPublicPath(path) {
    return joinPath(window.appMeta.baseUrl, path);
}

export function deepClone(obj) {
    return cloneDeep(obj);
}

// 创建一个默认的分页对象
export function createPagination(props = {}) {
    const {
        showSizeChanger = true,
        showQuickJumper = true,
        size = 'small',
        pageSizeOptions = ['10', '20', '30', '40'],
        pageSize = 20,
        current = 1,
        total = 0,
        data = [],
    } = props;
    return {
        showSizeChanger,
        showQuickJumper,
        size,
        pageSizeOptions,
        pageSize,
        current,
        total,
        data,
    };
}
// 分页加载
export function* fetchPageEffect({ payload }, { call }, page, action) {
    const params = {
        page_num: page.current,
        page_size: page.pageSize,
        ...payload,
    };
    const result = yield call(action, params);
    page.total = result.total;
    page.current = params.page_num;
    page.pageSize = params.page_size;
    page.data = result.data;
    return page;
}

export function toBoolean(val) {
    if (typeof val === 'boolean') return val;
    switch (val) {
        case 'true':
            return true;
        case 'false':
            return false;
        case 0:
        case '0':
            return false;
        case 1:
        case '1':
            return true;
        default:
            return !!val;
    }
}

/**
 * 将时间转换为UTC0时间
 * @param date  时间,moment/date/date string
 * @param opts  如果为字符串则参数为timeMode，对象则表示配置对象，
 * timeMode: 时间模式，默认不处理,dayStart一天开始，会把时间设置为 00:00:00;dayEnd一天结束，会把时间设置为 23:59:59
 * tz: 目标时区，默认不处理，传入标准的时区字符串会转换为对应时区的时间
 * @returns {*}
 */
export function toUTC0Date(date, opts) {
    if (!date) return null;
    date = moment(date);
    const defaultFormat = 'YYYY-MM-DD HH:mm:ss';
    if (typeof opts === 'string') opts = { timeMode: opts, format: defaultFormat };
    const { timeMode, tz, format = defaultFormat } = opts;
    if (timeMode === 'dayStart') date = date.startOf('day');
    else if (timeMode === 'dayEnd') date = date.endOf('day');
    if (tz) {
        if (tz === 'locale') {
            date = date.local();
        } else {
            date = moment.tz(date.format('YYYY-MM-DD HH:mm:ss'), tz);
        }
    }
    date = date.utc(0);
    return date.format(format);
}
// 常用正则验证规则
export const ValidateRegex = {
    Number: /^\d+$/,
    NumberOrLetter: /^[0-9a-zA-Z]*$/g,
    ABARNO: /\d{9}/,
    Tel: /^[0-9#,*()-]*$/g,
    URL: URL_REG,
};
// 补零
export function zeroize(str,n){
    if(null==str)return null;
    return (Array(n).join(0) + str).slice(-n);
}
