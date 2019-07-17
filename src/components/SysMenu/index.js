import React from 'react';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { getLocale } from 'umi/locale';
import classnames from 'classnames';
import styles from './index.less';
import { urlToList } from '@/utils';
import { getComponent } from './StatusIcon';

export default class extends React.Component {
    getLocaleTitle(title = {}) {
        return title[getLocale()];
    }

    getMenuItemPath = menu => {
        const getMenuContent = (item) => {
            if (item.res_type === 'StatusBar') {
                return <Icon className={styles.statusBarIcon} type={item.icon}/>;
            }
            return this.getLocaleTitle(item.title);

        };
        const itemPath = this.conversionPath(menu.route);
        const { target } = menu;
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {getMenuContent(menu)}
                </a>
            );
        }
        return (
            <Link
                to={itemPath}
                target={target}
                replace={itemPath === this.props.location.pathname}
                onClick={e => {
                    if (itemPath === this.getSelectedMenu()) e.preventDefault();
                }}
            >
                {getMenuContent(menu)}
            </Link>
        );
    };

    getMenus() {
        const menu = { sysMenu: [], statusMenu: [] };
        if (!this.props.menu) return menu;
        this.props.menu.forEach(item => {
            if (item.status != 1) return;
            if (item.res_type === 'StatusBar') {
                menu.statusMenu.push(item);
            } else {
                menu.sysMenu.push(item);
            }
        });
        return menu;
    }

    getSelectedMenu() {
        const { location: { pathname } } = this.props;
        const path = urlToList(pathname);
        return path[0];
    }

    conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        }
        return `/${path || ''}`.replace(/\/+/g, '/');
    };

    render() {
        const { onMenuClick, theme = 'light' } = this.props;
        const { sysMenu, statusMenu } = this.getMenus();
        const selectedKeys = this.getSelectedMenu();
        return (
            <Menu
                mode={'horizontal'}
                theme={theme}
                onClick={onMenuClick}
                className={classnames(styles.menu, styles.sysMenu)}
                selectedKeys={[selectedKeys]}
            >
                {sysMenu.map(item => (
                    <Menu.Item key={item.route} className={styles.menuItem}>{
                        this.getMenuItemPath(item)
                    }
                    </Menu.Item>
                ))}
                {statusMenu.map(item => (
                    <Menu.Item className={styles.statusBarMenuItem} key={item.route}>{
                        <div>{getComponent(item, this.props, this.getLocaleTitle(item.title)) || this.getMenuItemPath(item)}</div>
                    }
                    </Menu.Item>
                ))}
            </Menu>
        );
    }
}
