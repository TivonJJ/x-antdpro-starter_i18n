import React from 'react';
import {Form, Input, Modal, Select, Spin} from 'antd';
import {FormattedMessage,formatMessage} from "umi/locale";
import {connect} from "dva";

@connect(({userManage, loading}) => ({
    userManage,
    loadingRoles: loading.effects['userManage/fetchRoles']
}))
@Form.create()
class EditForm extends React.Component{
    componentDidMount() {
        this.fetchRoles();
    }

    setValues=(values)=>{
        this.props.form.setFieldsValue(values);
    };

    getValues=()=>{
        const {form} = this.props;
        return new Promise((resolve,reject)=>{
            form.validateFields((errors, values) => {
                if(errors){
                    reject(errors);
                    return;
                }
                resolve(values)
            })
        })
    };

    fetchRoles=()=>{
        this.props.dispatch({
            type:'userManage/fetchRoles',
            payload:{}
        }).catch(e=>{
            Modal.error({
                title:formatMessage({id:'Common.message.fetchFail'}),
                content:e.message
            })
        })
    };

    reset(){
        this.props.form.resetFields()
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {userManage:{roles},loadingRoles=false} = this.props;
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
                <Input type={"hidden"}/>
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
                    <Input maxLength={11}/>
                )}
            </Form.Item>
            <Spin spinning={loadingRoles}>
                <Form.Item {...formItemLayout} label={labels.roleName}>
                    {getFieldDecorator('role_id', {
                        rules: [{required:true, message: <FormattedMessage id={'Validator.phone'} values={{name:labels.roleName}}/>}]
                    })(
                        <Select>
                            {roles.map(role => (
                                    <Select.Option
                                        key={role.role_id}
                                        value={role.role_id}
                                    >
                                        {role.role_name}
                                    </Select.Option>
                                )
                            )}
                        </Select>
                    )}
                </Form.Item>
            </Spin>
               </Form>
    }
}

export default EditForm;
