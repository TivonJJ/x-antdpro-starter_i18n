"use strict";
import React from 'react';
import { Spin, Row, Col, Alert, Button, Icon, Table, Modal, Popconfirm, Card, message, Badge } from 'antd';
import FilterForm from './FilterForm';
import EditForm from './EditForm';
import Authorized from "@/components/Authorized";
import {SYSTEM_USER_ADD,SYSTEM_USER_UPDATE,SYSTEM_USER_RESET_PWD,SYSTEM_USER_DELETE,SYSTEM_USER_STATUS} from "@/components/Authorized/AuthMap";
import {connect} from "dva";
import {FormattedMessage,formatMessage} from "umi/locale";
import {Status} from "@/constants/user";

@connect(({userManage, loading}) => ({
    loading,
    userManage,
    loadingRoles: loading.effects['userManage/fetchRoles']
}))
export default class UserList extends React.Component{
    state={
        error:null,
        userEditFormVisible:false,
        editUser:null
    };
    columns=[
        {
            title: <FormattedMessage id={'Common.message.status'}/>,
            dataIndex: 'status',
            render(status){
                const statusLocaleId = Status[status];
                if(!statusLocaleId)return null;
                return <div className={'middle-inline_group'}>
                    <Badge status={status==1?'success':'error'}/>
                    <FormattedMessage id={statusLocaleId}/>
                </div>
            }
        },
        {
        title: <FormattedMessage id={'Model.system.user.username'}/>,
        dataIndex: 'username',
        render:(name,user)=>{
            return <Authorized route={SYSTEM_USER_UPDATE} noMatch={name}>
                <a onClick={()=>this.showUserEditModal(user)}>{name}</a>
            </Authorized>
        }
    }, {
        title: <FormattedMessage id={'Model.system.user.realName'}/>,
        dataIndex: 'real_name',
    }, {
        title: <FormattedMessage id={'Model.system.user.contact'}/>,
        dataIndex: 'tel_phone'
    },{
        title: <FormattedMessage id={'Model.system.user.roleName'}/>,
        dataIndex: 'role_name'
    },{
        title: <FormattedMessage id={'Common.message.operation'}/>,
        render:(val,user)=>{
            return <div className={'link-group'}>
                <Authorized route={SYSTEM_USER_RESET_PWD}>
                    <Popconfirm title={<FormattedMessage id={'Page.system.users.edit.resetPasswordConfirm'} values={{account:user.username}}/>} onConfirm={()=>this.handleResetPwd(user)}>
                        <a><FormattedMessage id={'Page.system.users.resetPassword'}/></a>
                    </Popconfirm>
                </Authorized>
                <Authorized route={SYSTEM_USER_STATUS}>
                    <Popconfirm title={<FormattedMessage id={'Page.system.users.edit.setStatusConfirm'} values={{
                        status:user.status==1?<FormattedMessage id={'Common.status.disabled'}/>:<FormattedMessage id={'Common.status.enabled'}/>
                    }}/>} onConfirm={()=>this.handleSetStatus(user)}>
                        <a>{user.status==1?<FormattedMessage id={'Common.message.disable'}/>:<FormattedMessage id={'Common.message.enable'}/>}</a>
                    </Popconfirm>
                </Authorized>
                <Authorized route={SYSTEM_USER_DELETE}>
                    <Popconfirm title={<FormattedMessage id={'Page.system.users.edit.deleteConfirm'} values={{account:user.username}}/>} onConfirm={()=>this.handleDel(user)}>
                        <a><FormattedMessage id={'Common.message.delete'}/></a>
                    </Popconfirm>
                </Authorized>
            </div>
        }
    }];
    componentDidMount(){
        this.fetchUsers();
    }
    componentWillUnmount(){
        this.props.dispatch({
            type:'userManage/$RESET'
        })
    }
    handleFilter=()=>{
        this.fetchUsers();
    };
    fetchUsers(){
        this.filterForm.validateFields((errors,values)=>{
            if(errors)return;
            this.props.dispatch({
                type:'userManage/fetch',
                payload:{
                    params:values
                }
            }).catch(e=>{
                this.setState({error:e.message})
            });
        })
    }
    fetchRoles=(params)=>{
        this.props.dispatch({
            type:'userManage/fetchRoles',
            payload:{params}
        }).catch(e=>{
            Modal.error({
                title:formatMessage({id:'Common.message.fetchFail'}),
                content:e.message
            })
        })
    };
    handelTableChange=(pagination)=>{
        this.props.dispatch({
            type:'userManage/changePagination',
            payload:{
                pagination
            }
        });
        this.fetchUsers();
    };
    handleResetPwd=(user)=>{
        this.props.dispatch({
            type:'userManage/resetUserPassword',
            payload:{
                userId:user.user_id
            }
        }).then(res=>{
          message.success(formatMessage({id:'Common.message.operationSuccess'}))
        },e=>{
            Modal.error({
                title:formatMessage({id:'Common.message.operationFailed'}),
                content:e.message
            })
        })
    };
    handleSetStatus=(user)=>{
        const targetStatus = user.status == 1?2:1;
        this.props.dispatch({
            type:'userManage/setUserStatus',
            payload:{
                params:{user_id:user.user_id,status:targetStatus}
            }
        }).then(()=>{
            message.success(formatMessage({id:'Common.message.operationSuccess'}))
        },e=>{
            message.error(e.message);
        })
    };
    handleDel=(user)=>{
        this.props.dispatch({
            type:'userManage/deleteUser',
            payload:{
                user_id:user.user_id,
                username:user.username
            }
        }).then(res=>{
          this.fetchUsers();
          message.success(formatMessage({id:'Common.message.operationSuccess'}))
        },e=>{
            message.error(e.message);
        })
    };
    showUserEditModal(user){
        this.setState({userEditFormVisible:true,editUser:user});
    }
    closeUserEditModal(){
        this.setState({userEditFormVisible:false,editUser:null});
        this.editForm.resetFields();
    }
    userEditDone(){
        this.editForm.validateFields((errors,values)=>{
            if(errors)return;
            this.props.dispatch({
                type:'userManage/upsertUser',
                payload:{
                    values
                }
            }).then((res)=>{
                if(res!==false){
                    this.fetchUsers();
                    this.closeUserEditModal();
                }
            },err=>{
                Modal.error({
                    title:formatMessage({id:'Common.message.error'}),
                    content:err.message
                })
            });
        });
    }
    render(){
        const {userEditFormVisible,error} = this.state;
        const {userManage,loading,loadingRoles=false} = this.props;
        const busy = loading.models.userManage;
        const {pagination,users,roles} = userManage;
        return <div className={'card-group'}>
            <Card bordered={false}>
                <FilterForm ref={ins=>this.filterForm=ins} onFilter={this.handleFilter}/>
            </Card>
            <Card bordered={false}>
                {error?<Alert
                    message={formatMessage({id: "Common.message.error"})}
                    description={error}
                    type="error"
                    showIcon
                />:
                    <Spin spinning={busy}>
                        <div className="gutter-h">
                            <Row className='gutter-v_lg'>
                                <Col span={12}><FormattedMessage id={'Common.pagination.total'} values={{total:pagination.total}}/></Col>
                                <Col span={12} className='text-right'>
                                    <Authorized route={SYSTEM_USER_ADD}>
                                        <Button type='primary' onClick={()=>this.showUserEditModal(null)}><Icon type="plus"/>
                                            <FormattedMessage id={'Common.message.add'}/>
                                        </Button>
                                    </Authorized>
                                </Col>
                            </Row>
                        </div>
                        <Table className='data-table' columns={this.columns}
                               onChange={this.handelTableChange.bind(this)}
                               pagination={pagination}
                               rowKey={(record,index)=>index}
                               dataSource={users}/>
                    </Spin>
                }
            </Card>
            <Modal
                width={500}
                title={<FormattedMessage id={'Page.system.users.edit.title'}/>}
                visible={userEditFormVisible}
                onCancel={()=>this.closeUserEditModal()}
                footer={[
                    <Button key="cancel" size="large" onClick={()=>this.closeUserEditModal()}><FormattedMessage id={'Common.button.cancel'}/></Button>,
                    <Button key="ok" type="primary" size="large" loading={busy} onClick={()=>this.userEditDone()}><FormattedMessage id={'Common.button.ok'}/></Button>
                ]}
            >
                <EditForm roles={roles} busy={loadingRoles} onFetchRoles={this.fetchRoles} ref={ins=>this.editForm=ins} user={this.state.editUser}/>
            </Modal>
        </div>
    }
}
