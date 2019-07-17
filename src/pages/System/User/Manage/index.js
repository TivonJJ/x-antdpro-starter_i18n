import React from 'react';
import { Card } from 'antd';
import FilterForm from './FilterForm';
import DataTable from './table';

export default function() {
    return (
        <div className={'card-group'}>
            <Card bordered={false}>
                <FilterForm/>
            </Card>
            <Card bordered={false}>
                <DataTable/>
            </Card>
        </div>
    )
}
