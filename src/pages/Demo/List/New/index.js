import React, { Component } from 'react';
import { Button, Card, Form, Input, InputNumber, Modal,message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import {formatMessage} from 'umi/locale';
import EasyTable from '@/components/EasyTable';

@EasyTable.connect(({demoTable})=>({
    demoTable
}))
@connect(({loading})=>({
    creating: loading.effects['demoList/insert']
}))
@Form.create()
class New extends Component {
    create=()=>{
        this.props.form.validateFields((errors, values) => {
            if(errors)return;
            this.props.dispatch({
                type:'demoList/insert',
                payload:values
            }).then(()=>{
                message.success(formatMessage({id:'Common.message.operationSuccess'}));
                router.goBack();
                // 更新父页面数据 并回调第一页
                this.props.demoTable.refresh({current:1});
            },err=>{
                Modal.error({
                    title:err.message
                });
                err.preventDefault();
            })
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const labels = {
            name:formatMessage({id:'Model.demo.name'}),
            amount:formatMessage({id:'Model.demo.amount'}),
        };
        return (
            <div>
                <Card bordered={false} title={formatMessage({id:'Common.message.add'})}>
                    <Form>
                        <Form.Item label={labels.name}>
                            {getFieldDecorator('name',{
                                rules:[{required:true,message:formatMessage({id:'Validator.required'},{name:labels.name})}]
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item label={labels.amount}>
                            {
                                getFieldDecorator('amount',{
                                    initialValue:10,
                                    rules:[{required:true,message:formatMessage({id:'Validator.required'},{name:labels.amount})}]
                                })(
                                    <InputNumber min={0}/>
                                )
                            }
                        </Form.Item>
                        <div>
                            <Form.Item>
                                <Button loading={this.props.creating} type={'primary'} onClick={this.create}>
                                    {formatMessage({id:'Common.button.submit'})}
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default New;
