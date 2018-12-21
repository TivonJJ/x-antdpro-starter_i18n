"use strict";
import React from 'react';
import {Form,Input,Select,Spin} from 'antd';
import {FormattedMessage,formatMessage} from "umi/locale";

@Form.create()
export default class EditForm extends React.Component{
    componentDidMount(){
        this.handlerUserChange(this.props.user);
    }
    componentWillReceiveProps(nextProps){
        if('user' in nextProps && this.props.user !== nextProps.user){
            this.handlerUserChange(nextProps.user)
        }
    }
    fetchRoles(){
        this.props.onFetchRoles();
    }
    handlerUserChange(user){
        if(undefined !== user)this.fetchRoles();
        if(!user)return;
        const values = {
            user_id:user.user_id,
            username:user.username,
            real_name:user.real_name,
            tel_phone:user.tel_phone,
            role_id:String(user.role_id)
        };
        this.props.form.setFieldsValue(values);
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const {roles,busy=false} = this.props;
        const formItemLayout = {
            labelCol:{ span: 6 },
            wrapperCol: { span: 18 }
        };
        const labels = {
            username:<FormattedMessage id={'Model.system.user.username'}/>,
            realName:<FormattedMessage id={'Model.system.user.realName'}/>,
            contact:<FormattedMessage id={'Model.system.user.contact'}/>,
            roleName:<FormattedMessage id={'Model.system.user.roleName'}/>
        };
        return <Form>
            {getFieldDecorator('user_id', {
            })(
                <Input type="hidden"/>
            )}
            <Form.Item {...formItemLayout} label={labels.username}>
                {getFieldDecorator('username', {
                    rules: [{required: true, message: <FormattedMessage id={'Validator.required'} values={{name:labels.username}}/>},
                        {type:'email',message:<FormattedMessage id={'Validator.email'}/>}]
                })(
                    <Input placeholder={formatMessage({id:"Page.system.users.form.username.placeholder"})}/>
                )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={labels.realName}>
                {getFieldDecorator('real_name', {
                    rules: [{
                        required: true, message: <FormattedMessage id={'Validator.required'} values={{name:labels.realName}}/>
                    }]
                })(
                    <Input placeholder={formatMessage({id:'Page.system.users.form.realName.placeholder'})}/>
                )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={labels.contact}>
                {getFieldDecorator('tel_phone', {
                    rules: [{pattern: /^1\d{10}$/, message: <FormattedMessage id={'Validator.phone'}/>}]
                })(
                    <Input maxLength="11"/>
                )}
            </Form.Item>
            <Spin spinning={busy}>
                <Form.Item {...formItemLayout} label={labels.roleName}>
                    {getFieldDecorator('role_id', {
                        rules: [{required:true, message: <FormattedMessage id={'Validator.phone'} values={{name:labels.roleName}}/>}]
                    })(
                        <Select>
                            {roles.map(role=>{
                                return <Select.Option key={role.role_id} value={String(role.role_id)}>{role.role_name}</Select.Option>
                            })}
                        </Select>
                    )}
                </Form.Item>
            </Spin>
        </Form>
    }
}
