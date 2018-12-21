import React from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { ServicePlatform } from '@/constants/logs';
import style from './style.less';
import { connect } from 'dva';
import moment from 'moment';



const { Item } = Form;
const { RangePicker } = DatePicker;
// const DEFAULT_OP_TIME = [moment().startOf('day'), moment()];
@connect()
@Form.create()
export default class LogFilterForm extends React.Component {
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.dispatch({
            type : 'logs/handleSearch',
            payload : this.props.form.getFieldsValue(),
        });
    };


    render(){
        const { getFieldDecorator } = this.props.form;
        const layout = {
            wrapperCol : { span : 14 },
            labelCol : { span : 10 },
        };
        return (
            <Card bordered={false}>
                <Form onSubmit={this.handleSubmit} className={style.resetFormMargin}>
                    <Row gutter={12}>
                        <Col lg={22}>
                            <Col md={12} lg={8}>
                                <Item {...layout}
                                      label={<FormattedMessage id={'Page.system.logs.label.operationTime'}/>}>
                                    {
                                        getFieldDecorator('create_time', /*{ initialValue : DEFAULT_OP_TIME }*/)(
                                            <RangePicker allowClear={false}/>)
                                    }
                                </Item>
                            </Col>
                            <Col md={12} lg={8}>
                                <Item {...layout}
                                      label={<FormattedMessage id={'Page.system.logs.label.platform'}/>}>
                                    {
                                        getFieldDecorator('platform')(
                                            <Select allowClear>
                                                {
                                                    Object.keys(ServicePlatform).map(item =>{
                                                        return <Select.Option key={item} value={item}> <FormattedMessage
                                                            id={ServicePlatform[item]}/> </Select.Option>;
                                                    })
                                                }
                                            </Select>,
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col md={12} lg={8}>
                                <Item {...layout} label={<FormattedMessage id={'Page.system.logs.label.keywords'}/>}>
                                    {
                                        getFieldDecorator('keywords')(<Input/>)
                                    }
                                </Item>
                            </Col>
                        </Col>
                        <Col lg={2}>
                            <Item><Button htmlType={'submit'} type={'primary'}><FormattedMessage
                                id={'Common.message.search'}/></Button></Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        );
    }
}



