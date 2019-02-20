'use strict';
import React from 'react';
import { Card } from 'antd';
import Page from './Page';
import { connect } from 'dva';
import {formatMessage} from 'umi/locale';

@connect(({permission,loading}) => ({
    permission,
    loading
}))
export default class extends React.Component{
    componentWillUnmount(){
        this.props.dispatch({
            type:'permission/reset'
        })
    }
    render(){
        return <Card bordered={false}>
            <Page permission={this.props.permission}
                  loading={this.props.loading.models.permission}
                  dispatch={this.props.dispatch}/>
        </Card>
    }
}
