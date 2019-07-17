import React, { Component } from 'react';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row } from 'antd';
import {removeEmptyProperty} from "@/utils";
import EasyTable from "@/components/EasyTable";
import {formatMessage,FormattedMessage} from 'umi/locale';

@EasyTable.connect(({demoKeepTable})=>({
    demoKeepTable
}))
@Form.create({
    mapPropsToFields(props){// 和Redux中存储的筛选条件数据进行表单双向绑定
        const map = {};
        if(props.demoKeepTable && props.demoKeepTable.params){
            Object.keys(props.demoKeepTable.params).forEach(key=>{
                map[key] = Form.createFormField({value:props.demoKeepTable.params[key]})
            })
        }
        return map;
    }
})
class Filter extends Component {
    handleSubmit=(evt)=>{
        evt.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if(errors)return;
            // 时间格式转换
            if(values.date && values.date.length===2){
                values.start_date = values.date[0].format('YYYY-MM-DD');
                values.end_date = values.date[1].format('YYYY-MM-DD');
                values.date = undefined;
            }
            this.props.demoKeepTable.fetch(removeEmptyProperty(values))
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol:{ span: 7 },
            wrapperCol: { span: 17 }
        };
        const collItemLayout = {md:8,sm:24};
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col {...collItemLayout}>
                        <Form.Item label={<FormattedMessage id={'Model.demo.no'} />} {...formItemLayout}>
                            {getFieldDecorator('no',{
                            })(
                                <Input placeholder={formatMessage({id:'Page.demo.search.numberPlaceholder'})} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...collItemLayout}>
                        <Form.Item label={<FormattedMessage id={'Model.demo.name'} />} {...formItemLayout}>
                            {getFieldDecorator('name',{
                            })(
                                <Input placeholder={formatMessage({id:'Page.demo.search.namePlaceholder'})} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...collItemLayout}>
                        <Form.Item label={<FormattedMessage id={'Model.demo.amount'} />} {...formItemLayout}>
                            {getFieldDecorator('amount',{
                            })(
                                <InputNumber min={0} style={{width:'100%'}} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...collItemLayout}>
                        <Form.Item label={<FormattedMessage id={'Model.demo.date'} />} {...formItemLayout}>
                            {getFieldDecorator('date',{
                            })(
                                <DatePicker.RangePicker />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <div className={'text-right'}>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'}><FormattedMessage id={'Common.message.search'} /></Button>
                    </Form.Item>
                </div>
            </Form>
        );
    }
}

export default Filter;
