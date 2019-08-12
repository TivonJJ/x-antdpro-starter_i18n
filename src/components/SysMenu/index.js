import React from 'react';
import {Menu, Icon, Row, Col} from 'antd';
import Link from 'umi/link';
import {getLocale} from "umi/locale";
import classnames from 'classnames';
import styles from './index.less';
import {urlToList} from "@/utils";
import {getComponent} from './StatusIcon';

export default class extends React.Component{
    getLocaleTitle = (title={})=>{
        return title[getLocale()];
    };

    getMenuItemPath = menu => {
        const getMenuContent = (item)=>{
            if(item.isStatusBar){
                return <Icon type={item.icon}/>
            }
                return this.getLocaleTitle(item.title)
            
        };
        const itemPath = this.conversionPath(menu.route);
        const {target} = menu;
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
                onClick={e=>{
                    if(itemPath===this.getSelectedMenu())e.preventDefault();
                }}
            >
                {getMenuContent(menu)}
            </Link>
        );
    };

    getMenus(){
        const menu = {sysMenu:[],statusMenu:[]};
        if(!this.props.menu)return menu;
        this.props.menu.forEach(item=>{
            if(item.status != 1)return;
            if(item.isStatusBar){
                menu.statusMenu.push(item);
            }else {
                menu.sysMenu.push(item);
            }
        });
        return menu;
    }

    getSelectedMenu(){
        const {location: {pathname}} = this.props;
        const path = urlToList(pathname);
        return path[0];
    }

    conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        }
        return `/${path || ''}`.replace(/\/+/g, '/');

    };

    render(){
        const {onMenuClick,theme='light'} = this.props;
        const {sysMenu,statusMenu} = this.getMenus();
        const selectedKeys = this.getSelectedMenu();
        const renderStatusBar = (item,title)=>{
            const comp = getComponent(item, this.props, title);
            if(comp){
                return <a>{comp}</a>;
            }
            return this.getMenuItemPath(item);
        };
        return <Row className={classnames(styles.menuRow, styles[theme])} type={'flex'}>
            <Col span={20} className={styles.menuSys}>
                <Menu
                    mode={'horizontal'}
                    theme={theme}
                    onClick={onMenuClick}
                    className={styles.menu}
                    selectedKeys={[selectedKeys]}
                >
                    {sysMenu.map(item => (
                        <Menu.Item key={item.route} className={styles.menuItem}>{
                            this.getMenuItemPath(item)
                        }
                        </Menu.Item>
                    ))}
                </Menu>
            </Col>
            <Col span={4} className={styles.menuStatus}>
                <Menu
                    mode={'horizontal'}
                    theme={theme}
                    className={classnames(styles.menu, styles.statusBarMenu)}
                    onClick={onMenuClick}
                    overflowedIndicator={<Icon type={'down'}/>}
                    selectedKeys={[selectedKeys]}
                >
                    {statusMenu.map(item => (
                        <Menu.Item className={styles.statusBarMenuItem} key={item.route}>
                            {renderStatusBar(item, this.getLocaleTitle(item.title))}
                        </Menu.Item>
                    ))}
                </Menu>
            </Col>
        </Row>
    }
}
