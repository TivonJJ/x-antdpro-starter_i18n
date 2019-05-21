import React, { Component } from 'react';
import { Card } from 'antd';
import Filter from './filter';
import Table from './table';
import SeesawView from '@/components/SeesawView';

@SeesawView()
class Demo extends Component {
    render() {
        return (
            <div className={'card-group'}>
                <Card bordered={false}>
                    <Filter/>
                </Card>
                <Card bordered={false}>
                    <Table/>
                </Card>
            </div>
        );
    }
}

export default Demo;
