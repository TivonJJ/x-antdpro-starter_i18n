import React from 'react';
import classnames from 'classnames';
import { Card } from 'antd';
import DocumentTitle from 'react-document-title';
import {formatMessage} from 'umi/locale';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import { getPublicPath } from '../utils';
import BaseLayout from './BaseLayout';

export default class UserLayout extends BaseLayout {

    render() {
        const {children} = this.props;
        return (
            <DocumentTitle title={this.getPageTitle()}>
                <div className={classnames(styles.container,'layout-body')}>
                    <div className={styles.content}>
                        <Card bordered={false} className={styles.contentCard}>
                            <div className={styles.top}>
                                <div className={styles.header}>
                                    <img alt={"logo"} className={styles.logo} src={getPublicPath('img/app-title-log.png')} />
                                    <div className={styles.sysName}>{formatMessage({id:'App.appName'})}</div>
                                </div>
                            </div>
                            {children}
                        </Card>
                    </div>
                    <GlobalFooter />
                </div>
            </DocumentTitle>
        );
    }
}
