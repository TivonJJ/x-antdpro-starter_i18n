import React, {Component} from 'react';
import {connect} from 'dva';
import { Checkbox, Alert, Modal, Form, Input, Icon, Spin, Button } from 'antd';
import {FormattedMessage,formatMessage,getLocale,setLocale} from "umi/locale";
import { isUrl } from '@/utils';
import router from 'umi/router';
import TrimInput from '@/components/TrimInput';
import styles from './Login.less';

export default
@Form.create()
@connect(({user, loading}) => ({
    user,
    submitting: loading.effects['user/login']
}))
class LoginPage extends Component {

    constructor(props){
        super(props);
        const lastUser = localStorage.getItem('last_username');
        this.state = {
            saveUsername: !!lastUser,
            lastUsername: lastUser,
            error:null
        };
    }

    handleSubmit=(evt)=>{
        evt.preventDefault();
        this.login();
    };

    login=()=>(
        new Promise((resolve, reject) => {
            this.props.form.validateFields((err,values)=>{
                if(err){
                    reject(err);
                    return;
                }
                this.props.dispatch({
                    type: 'user/login',
                    payload: values
                }).then((user)=>{
                    if(this.state.saveUsername){
                        localStorage.setItem('last_username',values.username)
                    }else {
                        localStorage.removeItem('last_username')
                    }
                    const currentLocale = getLocale();
                    if(user.language && currentLocale !== user.language){
                        setLocale(user.language)
                    }
                    this.goHome();
                    resolve();
                },(e)=>{
                    this.setState({error:e.message});
                    reject(e);
                });
            })
        })
    );

    goHome=()=>{
        const {query:{r:redirect}} = this.props.location;
        if(isUrl(redirect)){
            console.log('redirect to',redirect);
            window.location.href = redirect;
        }else {
            router.push('/');
        }
    };

    changeSaveUsername = e => {
        this.setState({
            saveUsername: e.target.checked,
        });
    };

    renderMessage = content => (
        <Alert style={{marginBottom: 24}} message={content} type={"error"} showIcon/>
    );

    forgotPassword = ()=>{
        Modal.info({
            title:'Coming soon !',
        })
    };

    render() {
        const {submitting=false} = this.props;
        const {error,lastUsername} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.login}>
                <Spin spinning={submitting}>
                    <Form onSubmit={this.handleSubmit}>
                        {error && !submitting && this.renderMessage(error)}
                        <Form.Item>
                            {getFieldDecorator('username', {
                                initialValue:lastUsername||'',
                                rules: [
                                    {required: true, message: formatMessage({id:'Page.login.username.validate.required'})}
                                ]
                            })(
                                <TrimInput
                                    prefix={<Icon type={'user'}/>}
                                    size={'large'}
                                    placeholder={formatMessage({id:'Page.login.username.placeholder'})}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: formatMessage({id:'Page.login.password.validate.required'})}
                                ]
                            })(
                                <Input
                                    prefix={<Icon type={'lock'}/>}
                                    type={'password'}
                                    size={'large'}
                                    placeholder={formatMessage({id:'Page.login.password.placeholder'})}
                                />
                            )}
                        </Form.Item>
                        <div>
                            <Checkbox checked={this.state.saveUsername} onChange={this.changeSaveUsername}>
                                <FormattedMessage id={'Page.login.rememberAccount'}/>
                            </Checkbox>
                            <a style={{float: 'right'}} onClick={this.forgotPassword}>
                                <FormattedMessage id={'Page.login.resetPassword'}/>
                            </a>
                        </div>
                        <Button
                            type={'primary'}
                            size={'large'}
                            htmlType={'submit'}
                            className={styles.submit}
                        >
                            {formatMessage({id:'Common.button.ok'})}
                        </Button>
                    </Form>
                </Spin>
            </div>
        )
    }
}

