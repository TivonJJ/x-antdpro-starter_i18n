import React, { Component } from 'react';
import { Card } from 'antd';
import Filter from './filter';
import Table from './table';
import SeesawView from '@/components/SeesawView';

class Demo extends Component {
    render() {
        return (
            <SeesawView child={this.props.children}>
                <div className={'card-group'}>
                    <Card bordered={false}>
                        <Filter/>
                    </Card>
                    <Card bordered={false}>
                        <Table/>
                    </Card>
                </div>
            </SeesawView>
        );
    }
}

export default Demo;
