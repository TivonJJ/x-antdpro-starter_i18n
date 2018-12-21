'use strict';
import React from 'react';
import {Alert, notification, Card, Col, Icon, message, Modal, Radio, Row, Spin, Switch} from 'antd';
import EditForm from './EditForm';
import AssignForm from './AssignForm';
import Authorized from '@/components/Authorized';
import {
    SYSTEM_ROLE_UPDATE,
    SYSTEM_ROLE_DELETE,
    SYSTEM_ROLE_DISTRIBUTION,
    SYSTEM_ROLE_ADD
} from '@/components/Authorized/AuthMap';

import {getPermissionsByRoleId, setUserToRole} from '@/services/system';
import style from '../nav-form.less'
import roleStyle from './style.less'
import {FormattedMessage,formatMessage} from "umi/locale";
import {Status} from "@/constants/role";

export default class extends React.Component {
    state = {
        error: null,
        editFormChanged: false,
        editFormVisible: false,
        assignVisible: false,
        assignChanged: false,
        currentRole: null,
        status: undefined,
    };

    componentDidMount() {
        this.loadRoles();
    }

    dispatch=(opts)=>{
        opts.type = 'role/' + opts.type;
        console.log('dispatch',opts);
        return this.props.dispatch(opts)
    };

    loadRoles(status) {
        this.dispatch({
            type: 'fetch',
            payload: {
                status
            }
        }).catch(e => {
            this.setState({
                error: e.message
            });
        });
    }


    toggleStatus(role, checked) {
        Modal.confirm({
            content: formatMessage({id: 'Page.system.roles.status.confirm'}, {
                status:checked?formatMessage({id:'Common.message.open'}):formatMessage({id:'Common.message.close'}),
                name: role.role_name
            }),
            onOk: () => {
                return this.dispatch({
                    type: 'setStatus',
                    payload: {
                        role_id: role.role_id,
                        status: checked ? 1 : 2,
                    },
                }).catch(e => {
                    notification.error({
                        message: formatMessage({id:'Common.message.error'}),
                        description: e.message
                    })
                });
            },
        });
    }

    delRole(role) {
        Modal.confirm({
            title: formatMessage({id:'Common.message.confirm'}),
            content: formatMessage({id:'Page.system.roles.delete.confirm'},{name:role.role_name}),
            onOk: () => {
                return this.dispatch({
                    type: 'deleteRole',
                    payload: {
                        role_id: role.role_id
                    }
                }).catch(e => {
                    notification.error({
                        message: formatMessage({id:'Common.message.error'}),
                        description: e.message
                    })
                })
            },
        });
    }

    showRoleEditModal(role) {
        this.setState({editFormVisible: true, currentRole: role, editFormChanged: false},()=>{
            this.dispatch({type: 'fetchPermissions'}).then(() => {
                if (!role) return
                this.dispatch({
                        type: 'fetchPermissionsByRoleId',
                        payload: role.role_id,
                    },
                ).then(permissions => {
                    const values = {
                        role_id: role.role_id,
                        role_name: role.role_name,
                        description: role.description,
                        status: role.status == 1,
                        res_list: this.unCompriseParentTree(permissions),
                    };
                    this.editForm.setFieldsValue(values);
                },err=>{
                    message.error(err.message);
                });
            }, err => {
                notification.error({
                    message: formatMessage({id:'Common.message.error'}),
                    description: err.message
                })
            });
        });
    }

    unCompriseParentTree = list => {
        const newList = [];
        if (!list || !list.length) return newList;
        const dnaMap = this.props.role.permissionsDNAMap;
        const dnaList = [];
        list.forEach(item => {
            dnaList.push(item.dna);
        });
        dnaList.sort((a, b) => a.length < b.length).forEach(item => {
            dnaList.forEach((dna, index) => {
                if (item && dna && item !== dna && item.startsWith(dna)) {
                    dnaList[index] = null;
                }
            });
        });
        dnaList.forEach(item => {
            if (!item) return;
            const permission = dnaMap[item];
            newList.push(String(permission.res_id));
        });
        return newList;
    };
    compriseParentTree = list => {
        const newList = [];
        if (!list || !list.length) return newList;
        const idMap = this.props.role.permissionsIDMap;
        const dnaMap = this.props.role.permissionsDNAMap;
        list.map(id => {
            id = String(id);
            const permission = idMap[id];
            if (newList.indexOf(id) === -1) newList.push(id);
            if (permission.$dna.length > 1) {
                //DNA链大于1则说明有父节点
                const chain = [...permission.$dna];
                while (chain.length > 1) {
                    chain.pop();
                    const dna = chain.join('-');
                    const permission = dnaMap[dna];
                    const id = String(permission.res_id);
                    if (newList.indexOf(id) === -1) newList.push(id);
                }
            }
        });
        return newList;
    };

    editRoleDone() {
        this.editForm.validateFields((err, values) => {
            if (err) return;
            values.res_list = this.compriseParentTree(values.res_list);
            this.updateInsertRole(values).then(()=>{
                message.success(formatMessage({id:'Common.message.operationSuccess'}));
                this.closeRoleEditModal();
            },e => {
                notification.error({
                    message: formatMessage({id:'Common.message.error'}),
                    description: e.message
                })
            });
        });
    }

    closeRoleEditModal() {
        this.setState({editFormVisible: false, currentRole: null, editFormChanged: false});
        this.editForm.resetFields();
    }

    updateInsertRole(role) {
        if (typeof role.status !== 'undefined') {
            role.status = role.status ? 1 : 0;
        }

        let type = role.role_id ? 'updateRole' : 'addRole';
        return this.dispatch({type, payload: role});
    }

    showAssignUserModal(role) {
        this.setState({assignVisible: true, currentRole: role, assignChanged: false});
    }

    closeAssignUserModal() {
        this.setState({assignVisible: false, currentRole: null, assignChanged: false});
    }

    assignOk() {
        const role = this.state.currentRole;
        const {targetKeys} = this.assignForm.state;
        const data = {
            role_id: role.role_id,
            already_alloc_userlist: [],
        };
        targetKeys.map(key => {
            data.already_alloc_userlist.push({
                user_id: key,
            });
        });
        setUserToRole(data).then(
            () => {
                message.success(formatMessage({id:'Common.message.operationSuccess'}));
                this.closeAssignUserModal();
                this.loadRoles();
            },
            err => {
                Modal.error({
                    content: err.message,
                });
            }
        );
    }
    renderFooter(role){
        if(role.is_preset==1)return <div className={'text-muted footer'}>{formatMessage({id:"Page.system.roles.isPreset"})}</div>;
        return <Row className="footer">
            <Col span={6}>
                <Authorized route={SYSTEM_ROLE_UPDATE}>
                    <Switch
                        onChange={status => this.toggleStatus(role, status)}
                        checked={role.status == 1}
                    />
                </Authorized>
            </Col>
            <Col span={18} className="text-right">
                <div className="link-group_dark">
                    <Authorized route={SYSTEM_ROLE_UPDATE}>
                        <a onClick={() => this.showRoleEditModal(role)}>
                            <FormattedMessage id={'Common.message.edit'}/>
                        </a>
                    </Authorized>
                    <Authorized route={SYSTEM_ROLE_DISTRIBUTION}>
                        <a onClick={() => this.showAssignUserModal(role)}>
                            <FormattedMessage id={'Page.system.roles.button.assign'}/>
                        </a>
                    </Authorized>
                    <Authorized route={SYSTEM_ROLE_DELETE}>
                        <a onClick={() => this.delRole(role)}>
                            <FormattedMessage id={'Common.message.delete'}/>
                        </a>
                    </Authorized>
                </div>
            </Col>
        </Row>
    }
    render() {
        const {error, editFormVisible, currentRole, assignVisible} = this.state;
        if (error) return <Alert message={<FormattedMessage id={'Common.message.error'}/>} description={error}
                                 type="error" showIcon/>;
        const {updating,fetching,role} = this.props;
        const {roles, status} = role;
        return <div>
            <div className={style.navForm}>
                <FormattedMessage id={'Common.message.status'}/>：
                <Radio.Group value={status} onChange={evt => this.loadRoles(evt.target.value)}>
                    <Radio.Button value={undefined}>(<FormattedMessage
                        id={"Common.message.all"}/>)</Radio.Button>
                    {Object.keys(Status).map(key => (
                        <Radio.Button key={key} value={key}><FormattedMessage
                            id={Status[key]}/></Radio.Button>
                    ))}
                </Radio.Group>
            </div>
            <Spin spinning={fetching}>
                <div className={roleStyle.roles}>
                    <div className="nav-bar"><FormattedMessage id={'Common.pagination.total'}
                                                               values={{total: roles.length}}/></div>
                    <Row gutter={16} className="grids">
                        {roles.map(role => {
                            return (
                                <Col span={8} key={role.role_id}>
                                    <Card
                                        title={role.role_name}
                                        extra={
                                            <div className="text-muted">
                                                <span className="count">{role.role_user_count}</span>
                                                <i className="fa fa-users users-icon"/>
                                            </div>
                                        }
                                    >
                                        <div className="body">
                                                    <span className="text-muted">
                                                        {/*<FormattedMessage id={'Common.message.description'}/>：*/}{role.description}
                                                    </span>
                                        </div>
                                        {this.renderFooter(role)}
                                    </Card>
                                </Col>
                            );
                        })}
                        <Col span={8}>
                            <Authorized route={SYSTEM_ROLE_ADD}>
                                <Card className="card-add" onClick={() => this.showRoleEditModal()}>
                                    <Icon type="plus" className="icon-add"/>
                                </Card>
                            </Authorized>
                        </Col>
                    </Row>
                </div>
            </Spin>
            <Modal
                width={800}
                title={<FormattedMessage id={'Page.system.roles.edit.formTitle'}/>}
                visible={editFormVisible}
                onCancel={() => this.closeRoleEditModal()}
                onOk={() => this.editRoleDone()}
                okButtonProps={{disabled: !this.state.editFormChanged}}
                confirmLoading={updating}
            >
                <Spin spinning={updating}>
                    <EditForm
                        ref={ref => (this.editForm = ref)}
                        role={currentRole}
                        permissions={role.permissions}
                        busy={fetching}
                        onChange={() => this.setState({editFormChanged: true})}
                    />
                </Spin>
            </Modal>
            <Modal
                width={600}
                title={<FormattedMessage id={'Page.system.roles.label.assignment'}/>}
                visible={assignVisible}
                onCancel={() => this.closeAssignUserModal()}
                onOk={()=>this.assignOk()}
                okButtonProps={{disabled:!this.state.assignChanged}}
            >
                <AssignForm
                    ref={ref => (this.assignForm = ref)}
                    role={currentRole}
                    onChange={() => this.setState({assignChanged: true})}
                />
            </Modal>
        </div>
    }
}
