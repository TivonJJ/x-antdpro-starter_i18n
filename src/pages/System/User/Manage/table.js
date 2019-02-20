import React, {Component} from 'react';
import EasyTable from "@/components/EasyTable";
import {getUsers} from "@/services/system";
import {
    SYSTEM_USER_ADD, SYSTEM_USER_DELETE,
    SYSTEM_USER_RESET_PWD,
    SYSTEM_USER_STATUS,
    SYSTEM_USER_UPDATE
} from "@/components/Authorized/AuthMap";
import {Badge, Button, Icon, message, Modal, Popconfirm} from "antd";
import Authorized from "@/components/Authorized";
import {FormattedMessage, formatMessage} from "umi/locale";
import EditForm from "./EditForm";
import DrawerConfirm from "@/components/DrawerConfirm";
import {Status} from "@/constants/user";
import {connect} from "dva";

@connect(({userManage, loading}) => ({
    userManage,
    upserting: loading.effects['userManage/upsertUser']
}))
class Table extends Component {
    state = {
        userEditFormVisible: false
    };
    columns = [
        {
            title: <FormattedMessage id={'Common.message.status'}/>,
            dataIndex: 'status',
            render(status) {
                const statusLocaleId = Status[status];
                if (!statusLocaleId) return null;
                return <div className={'middle-inline_group'}>
                    <Badge status={status == 1 ? 'success' : 'error'}/>
                    <FormattedMessage id={statusLocaleId}/>
                </div>
            }
        },
        {
            title: <FormattedMessage id={'Model.system.user.username'}/>,
            dataIndex: 'username',
            render: (name, user) => {
                return <Authorized route={SYSTEM_USER_UPDATE} noMatch={name}>
                    <a onClick={() => this.showUserEditModal(user)}>{name}</a>
                </Authorized>
            }
        }, {
            title: <FormattedMessage id={'Model.system.user.realName'}/>,
            dataIndex: 'real_name',
        }, {
            title: <FormattedMessage id={'Model.system.user.contact'}/>,
            dataIndex: 'tel_phone'
        }, {
            title: <FormattedMessage id={'Model.system.user.roleName'}/>,
            dataIndex: 'role_name'
        }, {
            title: <FormattedMessage id={'Common.message.operation'}/>,
            render: (val, user) => {
                return <div className={'link-group'}>
                    <Authorized route={SYSTEM_USER_RESET_PWD}>
                        <Popconfirm title={<FormattedMessage id={'Page.system.users.edit.resetPasswordConfirm'}
                                                             values={{account: user.username}}/>}
                                    onConfirm={() => this.handleResetPwd(user)}>
                            <a><FormattedMessage id={'Page.system.users.resetPassword'}/></a>
                        </Popconfirm>
                    </Authorized>
                    <Authorized route={SYSTEM_USER_STATUS}>
                        <Popconfirm title={<FormattedMessage id={'Page.system.users.edit.setStatusConfirm'} values={{
                            status: user.status == 1 ? <FormattedMessage id={'Common.status.disabled'}/> :
                                <FormattedMessage id={'Common.status.enabled'}/>
                        }}/>} onConfirm={() => this.handleSetStatus(user)}>
                            <a>{user.status == 1 ? <FormattedMessage id={'Common.message.disable'}/> :
                                <FormattedMessage id={'Common.message.enable'}/>}</a>
                        </Popconfirm>
                    </Authorized>
                    <Authorized route={SYSTEM_USER_DELETE}>
                        <Popconfirm title={<FormattedMessage id={'Page.system.users.edit.deleteConfirm'}
                                                             values={{account: user.username}}/>}
                                    onConfirm={() => this.handleDel(user)}>
                            <a><FormattedMessage id={'Common.message.delete'}/></a>
                        </Popconfirm>
                    </Authorized>
                </div>
            }
        }];
    handleResetPwd = (user) => {
        this.props.dispatch({
            type: 'userManage/resetUserPassword',
            payload: {
                userId: user.user_id
            }
        }).then(() => {
            message.success(formatMessage({id: 'Common.message.operationSuccess'}))
        }, e => {
            Modal.error({
                title: formatMessage({id: 'Common.message.operationFailed'}),
                content: e.message
            })
        })
    };
    handleSetStatus = (user) => {
        const targetStatus = user.status == 1 ? 2 : 1;
        this.props.dispatch({
            type: 'userManage/setUserStatus',
            payload: {
                params: {user_id: user.user_id, status: targetStatus}
            }
        }).then(() => {
            this.refresh();
            message.success(formatMessage({id: 'Common.message.operationSuccess'}))
        }, e => {
            message.error(e.message);
        })
    };
    handleDel = (user) => {
        this.props.dispatch({
            type: 'userManage/deleteUser',
            payload: {
                user_id: user.user_id,
                username: user.username
            }
        }).then(res => {
            message.success(formatMessage({id: 'Common.message.operationSuccess'}));
            this.refresh();
        }, e => {
            message.error(e.message);
        })
    };
    showUserEditModal = (user) => {
        this.setState({userEditFormVisible: true}, () => {
            if (user) this.editForm.setValues(user);
        });
    };
    closeUserEditModal = () => {
        this.setState({userEditFormVisible: false});
        this.editForm.reset();
    };
    upsertUser = () => {
        this.editForm.getValues().then((values) => {
            this.props.dispatch({
                type: 'userManage/upsertUser',
                payload: {
                    values
                }
            }).then((res) => {
                if (res !== false) {
                    this.closeUserEditModal();
                    this.refresh();
                }
            }, err => {
                Modal.error({
                    title: formatMessage({id: 'Common.message.error'}),
                    content: err.message
                })
            });
        });
    };

    refresh() {
        this.dataTable.refresh();
    }

    render() {
        const {userEditFormVisible} = this.state;
        const {upserting = false} = this.props;
        return (
            <div>
                <EasyTable name={'userManageDataTable'}
                           wrappedComponentRef={ref => this.dataTable = ref}
                           columns={this.columns}
                           rowKey={(record, index) => index}
                           source={getUsers}
                           autoFetch
                           extra={<Authorized route={SYSTEM_USER_ADD}>
                               <Button type='primary' onClick={() => this.showUserEditModal(null)}><Icon type="plus"/>
                                   <FormattedMessage id={'Common.message.add'}/>
                               </Button>
                           </Authorized>}
                />
                <DrawerConfirm
                    width={500}
                    title={<FormattedMessage id={'Page.system.users.edit.title'}/>}
                    visible={userEditFormVisible}
                    onCancel={this.closeUserEditModal}
                    confirmLoading={upserting}
                    onOk={this.upsertUser}
                >
                    <EditForm wrappedComponentRef={ins => this.editForm = ins}/>
                </DrawerConfirm>
            </div>
        );
    }
}

export default Table;
