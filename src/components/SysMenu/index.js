"use strict";
import React from 'react';
import {Menu, Icon} from 'antd';
import Link from 'umi/link';
import styles from './index.less';
import {urlToList} from "@/utils";
import {getComponent} from './StatusIcon';
import {FormattedMessage,formatMessage,getLocale} from "umi/locale";
import classnames from 'classnames';

export default class extends React.Component{
    getLocaleTitle(title={}){
        return title[getLocale()];
    }
    conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    };
    getMenuItemPath = item => {
        const getMenuContent = (item)=>{
            if(item.res_type==='StatusBar'){
                return <Icon className={styles.statusBarIcon} type={item.icon}/>
            }else {
                return this.getLocaleTitle(item.title)
            }
        };
        const itemPath = this.conversionPath(item.route);
        const {target} = item;
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {getMenuContent(item)}
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
                {getMenuContent(item)}
            </Link>
        );
    };

    getMenus(){
        const menu = {sysMenu:[],statusMenu:[]};
        if(!this.props.menu)return menu;
        this.props.menu.map(item=>{
            if(item.status != 1)return;
            if(item.res_type==='StatusBar'){
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

    render(){
        const {onMenuClick,theme='light'} = this.props;
        const {sysMenu,statusMenu} = this.getMenus();
        const selectedKeys = this.getSelectedMenu();
        return <Menu mode={'horizontal'} theme={theme} onClick={onMenuClick}
                     className={classnames(styles.menu,styles.sysMenu)}
                     selectedKeys={[selectedKeys]}>
            {sysMenu.map(item=>{
                return <Menu.Item key={item.route} className={styles.menuItem}>{
                    this.getMenuItemPath(item)
                }</Menu.Item>
            })}
            {statusMenu.map(item=>{
                return <Menu.Item className={styles.statusBarMenuItem} key={item.route}>{
                    <div>{getComponent(item,this.props,this.getLocaleTitle(item.title)) || this.getMenuItemPath(item)}</div>
                }</Menu.Item>
            })}
        </Menu>
    }
}
