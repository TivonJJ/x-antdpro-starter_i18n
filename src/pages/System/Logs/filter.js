import React from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { ServicePlatform } from '@/constants/logs';
import style from './style.less';
import EasyTable from '@/components/EasyTable';

const { Item } = Form;
const { RangePicker } = DatePicker;

@EasyTable.connect(({ logsDataTable }) => ({
    logsDataTable,
}))
@Form.create()
class LogFilterForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (errors) return;
            this.props.logsDataTable.fetch(values);
        });
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        const layout = {
            wrapperCol: { span: 14 },
            labelCol: { span: 10 },
        };
        return (
            <Card bordered={false}>
                <Form onSubmit={this.handleSubmit} className={style.resetFormMargin}>
                    <Row gutter={12}>
                        <Col lg={22}>
                            <Col md={12} lg={8}>
                                <Item
                                    {...layout}
                                    label={<FormattedMessage id={'Page.system.logs.label.operationTime'} />}
                                >
                                    {
                                        getFieldDecorator('create_time' /* { initialValue : DEFAULT_OP_TIME } */)(
                                            <RangePicker allowClear={false} />,
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col md={12} lg={8}>
                                <Item
                                    {...layout}
                                    label={<FormattedMessage id={'Page.system.logs.label.platform'}/>}
                                >
                                    {
                                        getFieldDecorator('platform')(
                                            <Select allowClear>
                                                {
                                                    Object.keys(ServicePlatform).map(item => (
                                                            <Select.Option key={item} value={item}>
                                                                <FormattedMessage
                                                                    id={ServicePlatform[item]}
                                                                />
                                                            </Select.Option>
                                                        ),
                                                    )
                                                }
                                            </Select>,
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col md={12} lg={8}>
                                <Item {...layout} label={<FormattedMessage id={'Page.system.logs.label.keywords'} />}>
                                    {
                                        getFieldDecorator('keywords')(<Input/>)
                                    }
                                </Item>
                            </Col>
                        </Col>
                        <Col lg={2}>
                            <Item>
                                <Button htmlType={'submit'} type={'primary'}>
                                    <FormattedMessage id={'Common.message.search'}/>
                                </Button>
                            </Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        );
    }
}

export default LogFilterForm;
