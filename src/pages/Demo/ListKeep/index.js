import React from 'react';
import { Card } from 'antd';
import Filter from './filter';
import Table from './table';

export default function() {
    return (
        <div className={'card-group'}>
            <Card bordered={false}>
                <Filter />
            </Card>
            <Card bordered={false}>
                <Table />
            </Card>
        </div>
    );
};
