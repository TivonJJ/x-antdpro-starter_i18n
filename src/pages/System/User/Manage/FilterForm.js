"use strict";
import React from 'react';
import {Form,Row,Col,Radio,Input} from 'antd';
import styles from '../nav-form.less';
import {Status} from '@/constants/user';
import {FormattedMessage,formatMessage} from "umi/locale";
import EasyTable from "@/components/EasyTable";

@EasyTable.connect(({userManageDataTable})=>({
    userManageDataTable
}))
@Form.create({
    onValuesChange(props,changedVal,vals){
        props.userManageDataTable.fetch(vals);
    }
})
export default class FilterForm extends React.Component{
    render(){
        const {getFieldDecorator} = this.props.form;
        return <Form className={styles.navForm}>
            <Row>
                <Col span={3} className='form-label'><FormattedMessage id={'Common.message.status'}/>：</Col>
                <Col span={21} className='form-control'>
                    {getFieldDecorator('status', {
                    })(
                        <Radio.Group>
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
                        <Input.Search placeholder={
                            formatMessage({id:'Page.system.users.searchByKey.placeholder'})
                        } style={{width:260}}/>
                    )}
                </Col>
            </Row>
        </Form>
    }
}
