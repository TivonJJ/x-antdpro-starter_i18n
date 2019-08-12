import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Menu, Icon, Dropdown, Avatar } from 'antd';
import router from 'umi/router';
import styles from './index.less';

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
            default:
                break;
        }
    };

    render() {
        const {
            currentUser,
            theme,
            isMobile
        } = this.props;
        let className = styles.right;
        if (theme === 'dark') {
            className = `${styles.right}  ${styles.dark}`;
        }
        if (!currentUser) return null;
        const menu = (
            <Menu theme={theme} className={styles.menu} selectedKeys={[]} onClick={this.handleUserMenuClick}>
                <Menu.Item key={"modifyPassword"}>
                    <Icon type={"setting"}/> <FormattedMessage id={'Component.globalHeader.menu.changePassword'}/>
                </Menu.Item>
                <Menu.Item key={"logout"}>
                    <Icon type={"logout"}/> <FormattedMessage id={'Component.globalHeader.menu.logout'}/>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className={className}>
                <Dropdown overlay={menu}>
                    <div className={`${styles.action} ${styles.account}`}>
                        <Avatar
                            size={isMobile?'small':'large'}
                            title={currentUser.real_name}
                            className={styles.avatar}
                            style={{
                                backgroundColor:currentUser.avatar.bgColor,
                                color:currentUser.avatar.color
                            }}
                            src={currentUser.avatar.src}
                            alt={currentUser.real_name}
                        >
                            {currentUser.avatar.content}
                        </Avatar>
                    </div>
                </Dropdown>
            </div>
        );
    }
}
