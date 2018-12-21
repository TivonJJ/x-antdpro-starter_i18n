import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Menu, Icon, Dropdown, Avatar } from 'antd';
import styles from './index.less';
import router from 'umi/router';

export default class GlobalHeaderRight extends PureComponent {
    handleUserMenuClick = ({key}) => {
        switch (key){
            case 'logout':
                window.g_app._store.dispatch({
                    type: 'user/logout',
                });
                break;
            case 'modifyPassword':
                router.push('/user/changePassword');
                break;
        }
    };
    render() {
        const {
            currentUser,
            theme,
        } = this.props;
        let className = styles.right;
        if (theme === 'dark') {
            className = `${styles.right}  ${styles.dark}`;
        }
        if (!currentUser) return null;
        const menu = (
            <Menu theme={theme} className={styles.menu} selectedKeys={[]} onClick={this.handleUserMenuClick}>
                <Menu.Item key='modifyPassword'>
                    <Icon type="setting"/> <FormattedMessage id={'Component.globalHeader.menu.changePassword'}/>
                </Menu.Item>
                <Menu.Item key="logout">
                    <Icon type="logout"/> <FormattedMessage id={'Component.globalHeader.menu.logout'}/>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className={className}>
                <Dropdown overlay={menu}>
                    <div className={`${styles.action} ${styles.account}`}>
                      <Avatar
                          size="small"
                          className={styles.avatar}
                          src={currentUser.avatar}
                          alt="avatar"
                      />
                      <span className={styles.name}>{currentUser.real_name}</span>
                    </div>
                </Dropdown>
            </div>
        );
    }
}
