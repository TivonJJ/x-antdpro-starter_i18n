import React, { Component } from 'react';
import { Card } from 'antd';
import Filter from './filter';
import Table from './table';
import { connect } from 'dva';
import SeesawView from '@/components/SeesawView';

@connect(({demoList})=>({
    demoList
}))
class Demo extends Component {
    componentWillUnmount() {
        // 销毁时清空状态
        this.props.dispatch({type:'demoList/$RESET'})
    }
    handleFilter=(params)=>{
        this.props.dispatch({
            type:'demoList/search',
            payload:params
        })
    };
    render() {
        const {demoList:{query},children} = this.props;
        return (
            <SeesawView child={children}>
                <div className={'card-group'}>
                    <Card bordered={false}>
                        <Filter onSubmit={this.handleFilter}/>
                    </Card>
                    <Card bordered={false}>
                        <Table query={query}/>
                    </Card>
                </div>
            </SeesawView>
        );
    }
}

export default Demo;
