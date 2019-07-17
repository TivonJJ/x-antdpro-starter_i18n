import React, { PureComponent } from 'react';
import { Col, Icon, Row } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import SysMenu from '../SysMenu';
import { getPublicPath } from '@/utils';

const logo = getPublicPath('img/app-logo_light.png');

export default class GlobalHeader extends PureComponent {
    componentWillUnmount() {
        this.triggerResizeEvent.cancel();
    }

    /* eslint-disable*/
    @Debounce(600)
    triggerResizeEvent() {
        // eslint-disable-line
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }

    toggle = () => {
        const { collapsed, onCollapse } = this.props;
        onCollapse(!collapsed);
        this.triggerResizeEvent();
    };

    render() {
        const { collapsed,collapsable=true, isMobile, currentUser,onSysMenuClick,theme } = this.props;
        return (
            <div className={`${styles.header} ${theme==='light'?styles.light:''}`}>
                <Row type={'flex'}>
                    <Col span={2} className={styles.headerLeft}>
                        {isMobile && (
                            <Link to="/" className={styles.logo} key="logo">
                                <img src={logo} alt="logo" width="32"/>
                            </Link>
                        )}
                        {collapsable&&(
                            <Icon
                                className={styles.trigger}
                                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                        )}
                    </Col>
                    <Col span={18} className={styles.headerCenter}>
                        {currentUser &&
                        <SysMenu className={styles.action} menu={currentUser.menus} onMenuClick={onSysMenuClick}
                                 {...this.props}/>}
                    </Col>
                    <Col span={4} className={styles.headerRight}>
                        <RightContent {...this.props}/>
                    </Col>
                </Row>
            </div>
        );
    }
}
