'use strict';
import React from 'react';
import ModifyForm from './ModifyForm';
import style from './style.less';
import {connect} from "dva";
import {message,Modal} from "antd";
import {FormattedMessage,formatMessage} from "umi/locale";

@connect(({user, loading}) => ({
    currentUser:user.currentUser,
    submitting: loading.effects['user/modifyPassword'],
}))
export default class extends React.Component{
    updatePassword=(vals)=>{
        this.props.dispatch({
            type:'user/modifyPassword',
            payload:{
                params:{
                    username:this.props.currentUser.username,
                    ...vals
                }
            }
        }).then(()=>{
            message.success(formatMessage({id:'Page.changePassword.successTip'}));
            this.modifyForm.resetFields();
            this.props.dispatch({
                type: 'user/logout',
            });
        },err=>{
            Modal.error({
                content:err.message
            })
        })
    };
    render(){
        const {submitting=false} = this.props;
        return <div>
            <div className={style.form}>
                <div>
                    <ModifyForm ref={ref=>this.modifyForm=ref} busy={submitting} onUpdatePassword={this.updatePassword}/>
                </div>
            </div>
        </div>
    }
}
