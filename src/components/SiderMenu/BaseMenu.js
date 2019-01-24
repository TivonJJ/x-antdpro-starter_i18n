import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { formatMessage, FormattedMessage,getLocale } from 'umi/locale';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '@/utils';
import styles from './index.less';

const { SubMenu } = Menu;

const getIcon = icon => {
    if (!icon) return null;
    if (typeof icon === 'string' && icon.indexOf('http') === 0) {
        return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`}/>;
    }
    if (typeof icon === 'string') {
        return <Icon type={icon}/>;
    }
    return null;
};

export const getMenuMatches = (flatMenuKeys, path) => flatMenuKeys.filter(item => item && pathToRegexp(item).test(path));

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menuData
 */
export const getFlatMenuKeys = menuData => {
    let keys = [];
    if(!menuData)return keys;
    menuData.forEach(item => {
        if (item.children) {
            keys = keys.concat(getFlatMenuKeys(item.children));
        }
        keys.push(item.route);
    });
    return keys;
};

export default class BaseMenu extends PureComponent {
    constructor(props) {
        super(props);
    }

    getLocaleTitle(title={}){
        return title[getLocale()];
    }
    /**
     * 获得菜单子节点
     * @memberof SiderMenu
     */
    getNavMenuItems = (menusData, isRoot) => {
        if (!menusData) {
            return [];
        }
        return menusData
            .filter(item => !item.isAction && item.status == 1)
            .map(item => {
                return this.getSubMenuOrItem(item, isRoot);
            });
    };

    // Get the currently selected menu
    getSelectedMenuKeys = () => {
        const {
            location: { pathname },
        } = this.props;
        return urlToList(pathname).map(itemPath => {
            return getMenuMatches(this.props.flatMenuKeys, itemPath).pop()
        });
    };

    /**
     * get SubMenu or Item
     */
    getSubMenuOrItem = (item, isRoot) => {
        if (item.isDir) {
            const childrenItems = this.getNavMenuItems(item.children);
            // 当无子菜单时就不展示菜单
            if (childrenItems && childrenItems.length > 0) {
                return (
                    <SubMenu
                        title={
                            item.icon ? (
                                <label>
                                    {getIcon(item.icon)}
                                    <span>{this.getLocaleTitle(item.title)}</span>
                                </label>
                            ) : (
                                <span>{this.getLocaleTitle(item.title)}</span>
                            )
                        }
                        key={item.route}
                    >
                        {childrenItems}
                    </SubMenu>
                );
            }
            return null;
        } else {
            return <Menu.Item key={item.route}
                              className={isRoot ? styles.finalMenu : ''}>{this.getMenuItemPath(item)}</Menu.Item>;
        }
    };

    /**
     * 判断是否是http链接.返回 Link 或 a
     * Judge whether it is http link.return a or Link
     * @memberof SiderMenu
     */
    getMenuItemPath = item => {
        const name = this.getLocaleTitle(item.title);
        const itemPath = this.conversionPath(item.route);
        const icon = getIcon(item.icon);
        const { target, title } = item;
        // Is it a http link
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {icon}
                    <span>{name}</span>
                </a>
            );
        }
        const { location, isMobile, onCollapse } = this.props;
        return (
            <Link
                to={itemPath}
                target={target}
                replace={itemPath === location.pathname}
                onClick={
                    isMobile
                        ? () => {
                            onCollapse(true);
                        }
                        : undefined
                }
            >
                {icon}
                <span>{this.getLocaleTitle(title)}</span>
            </Link>
        );
    };

    conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    };

    render() {
        const { openKeys, theme, mode } = this.props;
        // if pathname can't match, use the nearest parent's key
        let selectedKeys = this.getSelectedMenuKeys();
        // console.log(selectedKeys)
        if (!selectedKeys.length && openKeys) {
            selectedKeys = [openKeys[openKeys.length - 1]];
        }
        let props = {};
        if (openKeys) {
            props = {
                openKeys,
            };
        }
        const { handleOpenChange, style, menuData } = this.props;
        return (
            <Menu
                key="Menu"
                mode={mode}
                theme={theme}
                onOpenChange={handleOpenChange}
                selectedKeys={selectedKeys}
                style={style}
                {...props}
            >
                {this.getNavMenuItems(menuData, true)}
            </Menu>
        );
    }
}
