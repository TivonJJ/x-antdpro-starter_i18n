'use strict';
import React from 'react';
import styles from './index.less';
import Link from 'umi/link';
import { getPublicPath } from '@/utils';
import classNames from 'classnames';

export default class extends React.PureComponent{
    render() {
        const {theme,className,style} = this.props;
        return (
            <div className={classNames(styles.logo, {
                [styles.light]: theme === 'light',
            },className)} style={style}>
                <Link to="/">
                    <img src={getPublicPath('img/app-logo_light.png')} className={styles.logoIcon}/>
                    <img className={styles.logoName} src={getPublicPath('img/app-logo_name_light.png')}/>
                </Link>
            </div>
        );
    }
}
