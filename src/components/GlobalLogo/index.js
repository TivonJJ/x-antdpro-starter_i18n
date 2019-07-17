import React from 'react';
import Link from 'umi/link';
import { getPublicPath } from '@/utils';
import classNames from 'classnames';
import styles from './index.less';

export default class extends React.PureComponent{
    render() {
        const {theme,className,style} = this.props;
        return (
            <div
                className={classNames(styles.logo, {
                    [styles.light]: theme === 'light',
                },className)}
                style={style}
            >
                <Link to={"/"}>
                    <img alt={''} src={getPublicPath('img/app-logo_light.png')} className={styles.logoIcon}/>
                    <img alt={''} className={styles.logoName} src={getPublicPath('img/app-logo_name_light.png')}/>
                </Link>
            </div>
        );
    }
}
