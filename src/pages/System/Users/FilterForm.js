"use strict";
import React from 'react';
import {Form,Row,Col,Radio,Input} from 'antd';
import styles from '../nav-form.less';
import {Status} from '@/constants/user';
import {FormattedMessage,formatMessage} from "umi/locale";

@Form.create()
export default class FilterForm extends React.Component{
    handelFilter(){
        setTimeout(()=>{//避免radio状态value未更新
            this.props.onFilter && this.props.onFilter(this.props.form);
        },10);
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        return <Form className={styles.navForm}>
            <Row>
                <Col span={3} className='form-label'><FormattedMessage id={'Common.message.status'}/>：</Col>
                <Col span={21} className='form-control'>
                    {getFieldDecorator('status', {
                    })(
                        <Radio.Group onChange={this.handelFilter.bind(this)}>
                            <Radio.Button>(<FormattedMessage id={"Common.message.all"}/>)</Radio.Button>
                            {Object.keys(Status).map(key=>(
                                <Radio.Button key={key} value={key}><FormattedMessage id={Status[key]}/></Radio.Button>
                            ))}
                        </Radio.Group>
                    )}
                </Col>
            </Row>
            <Row>
                <Col span={3} className='form-label'><FormattedMessage id={'Page.system.users.searchByKey.label'}/>：</Col>
                <Col span={21} className='form-control'>
                    {getFieldDecorator('keywords', {
                    })(
                        <Input.Search onSearch={this.handelFilter.bind(this)} placeholder={
                            formatMessage({id:'Page.system.users.searchByKey.placeholder'})
                        } style={{width:260}}/>
                    )}
                </Col>
            </Row>
        </Form>
    }
}
