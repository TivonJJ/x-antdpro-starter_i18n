"use strict";
import React from 'react';
import {Icon} from "antd";
import styles from './style.less';
import classnames from 'classnames';

export default class extends React.PureComponent{
    render() {
        const {className,contentClass,style,children,title,icon,iconTheme='outlined',extra,color,iconSize=46} = this.props;
        return (
            <div className={classnames(className,styles.wrapper)} style={style}>
                {icon&&
                <div className={styles.icon}>
                    <Icon type={icon} theme={iconTheme} style={{color,fontSize:iconSize}}/>
                </div>
                }
                <div className={classnames(styles.content,contentClass)}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.amount}>{children || '-'}</div>
                    <div className={styles.extra}>{extra}</div>
                </div>
            </div>
        );
    }
}
