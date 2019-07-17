import React from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import Page from './Page';

export default
@connect(({permission,loading}) => ({
    permission,
    loading
}))
class extends React.Component{
    componentWillUnmount(){
        this.props.dispatch({
            type:'permission/reset'
        })
    }

    render(){
        return <Card bordered={false}>
            <Page
permission={this.props.permission}
                  loading={this.props.loading.models.permission}
                  dispatch={this.props.dispatch}
            />
               </Card>
    }
}
