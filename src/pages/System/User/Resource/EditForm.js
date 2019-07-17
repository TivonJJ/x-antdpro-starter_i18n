import React from 'react';
import {Form,Input,Radio} from 'antd';
import {FormattedMessage} from "umi/locale";
import {ResTypes,Status} from '@/constants/permission';
import MultilingualInput from './MultilingualInput';

export const FieldsProps = ['res_type','res_name','status','res_url','icon_url','description'];

export default
@Form.create()
class extends React.Component{
    componentWillReceiveProps(nextProps){
        if(this.props.permission && nextProps.permission && this.props.permission !== nextProps.permission
            && nextProps.permission.selectedPermission
        && this.props.permission.selectedPermission !== nextProps.permission.selectedPermission){
            this.setFormValues(nextProps.permission.selectedPermission);
        }
    }

    setFormValues(values){
        const props = FieldsProps;
        const newVals = {};
        props.forEach(key=>{
            newVals[key] = values[key];
        });
        this.props.form.setFieldsValue(newVals);
    }

    handleChange=(evt)=>{
        this.props.onChange && this.props.onChange(evt);
    };

    render(){
        const {form,permission} = this.props;
        const {getFieldDecorator,getFieldValue} = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };
        let level = 0;
        const type = getFieldValue('res_type');
        const {selectedPermission} = permission;
        if(selectedPermission){
            level = selectedPermission.$dna.length
        }
        const labels = {
            type:<FormattedMessage id={'Model.permissions.type'}/>,
            name:<FormattedMessage id={'Model.permissions.name'}/>,
            status:<FormattedMessage id={'Model.permissions.status'}/>,
            uri:<FormattedMessage id={'Model.permissions.uri'}/>,
            icon:<FormattedMessage id={'Model.permissions.icon'}/>,
            describe:<FormattedMessage id={'Model.permissions.describe'}/>
        };
        return (
            <Form onChange={this.handleChange}>
                <Form.Item {...formItemLayout} label={labels.type}>
                    {getFieldDecorator('res_type', {
                        initialValue:'Menu',
                        rules: [{
                            required: true, message: <FormattedMessage id={'Validator.required'} values={{name:labels.type}}/>
                        }]
                    })(
                        <Radio.Group>
                            {ResTypes.map(resType=>{
                                if('level' in resType && resType.level !== level)return null;
                                return <Radio key={resType.value} value={resType.value}><FormattedMessage id={resType.label}/></Radio>
                            })}
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={labels.name}>
                    {getFieldDecorator('res_name', {
                        rules: [{
                            validator: MultilingualInput.Validator, message: <FormattedMessage id={'Validator.incomplete'} values={{name:labels.name}}/>
                        }]
                    })(
                        <MultilingualInput/>
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={labels.status}>
                    {getFieldDecorator('status', {
                        initialValue:1,
                        rules: [{
                            required: true, message: <FormattedMessage id={'Validator.required'} values={{name:labels.status}}/>
                        }]
                    })(
                        <Radio.Group>
                            {Object.keys(Status).map(key=>(
                                <Radio value={Number(key)} key={key}><FormattedMessage id={Status[key]}/></Radio>
                            ))}
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={labels.uri}>
                    {getFieldDecorator('res_url', {
                        rules: [{
                            required: true, message: <FormattedMessage id={'Validator.required'} values={{name:labels.uri}}/>
                        }]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={labels.icon}>
                    {getFieldDecorator('icon_url', {
                        rules: level===2||type==='StatusBar'?[{
                            required: true, message: <FormattedMessage id={'Validator.required'} values={{name:labels.icon}}/>
                        }]:[]
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={labels.describe}>
                    {getFieldDecorator('description', {
                    })(
                        <Input.TextArea rows={5}/>
                    )}
                </Form.Item>
            </Form>
        )
    }
}
