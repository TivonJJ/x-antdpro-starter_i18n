import React, { Fragment } from 'react';
import { Form, Input, Modal } from 'antd';
import {formatMessage,getLocale} from 'umi/locale';

export default class extends React.Component{
    static Validator(rule, value, callback){
        const errors = [];
        if(!value || Object.keys(value).length<=0)errors.push(new Error('This field is required'));
        else {
            Object.keys(value).forEach(key=>{
                if(!value[key]){
                    errors.push(new Error(`${key} is required`))
                }
            })
        }
        callback(errors);
    };

    state={
        modalVisible:false
    };

    showModal=()=>{
        this.setState({modalVisible:true})
    };

    hideModal=()=>{
        this.setState({modalVisible:false})
    };

    handleOk=()=>{
        this.form.validateFields((errors,values)=>{
            if(errors)return;
            this.props.onChange(values);
            this.hideModal();
        })
    };

    handleFormMount=(form)=>{
        this.form = form;
        if(form){
            const {value={}} = this.props;
            form.setFieldsValue(value);
        }
    };

    render(){
        const {value={}} = this.props;
        return (
            <Fragment>
                <Input readOnly value={value[getLocale()]} onClick={this.showModal}/>
                <Modal
                    destroyOnClose
                    title={formatMessage({id:'Page.system.permissions.i18nNameTitle'})}
                    visible={this.state.modalVisible}
                    onCancel={this.hideModal}
                    onOk={this.handleOk}
                >
                    <EditForm ref={this.handleFormMount}/>
                </Modal>
            </Fragment>
        )
    }
}

// eslint-disable-next-line react/no-multi-comp
@Form.create()
class EditForm extends React.Component{
    SupportedLang=['en-US','zh-CN'];

    render(){
        const {form} = this.props;
        const formItemLayout={
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            }
        };
        return (
            <Form>
                {this.SupportedLang.map(lang=>(
                    <Form.Item {...formItemLayout} label={lang} key={lang}>
                        {form.getFieldDecorator(lang,{
                            rules:[{required:true,message:formatMessage({id:'Validator.required'},{name:lang})}]
                        })(
                            <Input/>
                        )}
                    </Form.Item>
                ))}
            </Form>
        )
    }
}
