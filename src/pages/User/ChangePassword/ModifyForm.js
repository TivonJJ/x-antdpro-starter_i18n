"use strict";
import React from 'react';
import {Form,Input,Row,Col,Button,Modal} from 'antd';
import style from './style.less';
import {FormattedMessage,formatMessage} from "umi/locale";

const labels = {
    password:<FormattedMessage id={'Page.changePassword.oldPassword.label'}/>,
    newPassword:<FormattedMessage id={'Page.changePassword.newPassword.label'}/>,
    confirmPassword:<FormattedMessage id={'Page.changePassword.confirmPassword.label'}/>
};

@Form.create()
export default class ModifyForm extends React.Component{
    submit=(evt)=>{
        evt.preventDefault();
        const {form} = this.props;
        form.validateFields((errs,vals)=>{
            if(errs)return;
            if(vals.new_password !== vals.re_new_password){
                return Modal.error({
                    content:formatMessage({id:'Validator.equals'},{
                        a:formatMessage({id:'Page.changePassword.newPassword.label'}),
                        b:formatMessage({id:'Page.changePassword.confirmPassword.label'})
                    })
                })
            }
            this.props.onUpdatePassword(vals);
        })
    };
    render(){
        const {busy} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            // labelCol:{ span: 8 },
            // wrapperCol: { span: 16 }
        };
        return <Form onSubmit={this.submit}>
            <Form.Item {...formItemLayout}>
                {getFieldDecorator('password', {
                    rules: [{required: true,
                        message: <FormattedMessage
                            id={'Validator.required'}
                            values={{name:labels.password}}/>}]
                })(
                    <Input type='password' placeholder={formatMessage({id:'Page.changePassword.oldPassword.placeholder'})}/>
                )}
            </Form.Item>
            <Form.Item {...formItemLayout}>
                {getFieldDecorator('new_password', {
                    rules: [{required: true,
                        message: <FormattedMessage
                            id={'Validator.required'}
                            values={{name:labels.newPassword}}/>},{
                        pattern:/[a-zA-Z0-9~!@#$%^&*()_+-=;':",./<>?`]{6,16}/,
                        message: <FormattedMessage
                            id={'Validator.pattern'}
                            values={{name:labels.newPassword}}/>
                    }]
                })(
                    <Input type='password' placeholder={formatMessage({id:'Page.changePassword.newPassword.placeholder'})}/>
                )}
            </Form.Item>
            <Form.Item {...formItemLayout}>
                {getFieldDecorator('re_new_password', {
                    rules: [{required: true, message: <FormattedMessage id={'Validator.required'}
                                                                        values={{name:labels.confirmPassword}}/>}]
                })(
                    <Input type='password' placeholder={formatMessage({id:'Page.changePassword.confirmPassword.placeholder'})}/>
                )}
            </Form.Item>
            <Form.Item>
                <Button type='primary' className={style.submitBtn} htmlType='submit' size='large' loading={busy}>
                    <FormattedMessage id={'Common.button.apply'}/>
                </Button>
            </Form.Item>
        </Form>
    }
}
