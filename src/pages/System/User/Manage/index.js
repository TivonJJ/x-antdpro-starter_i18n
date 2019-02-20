"use strict";
import React from 'react';
import { Card } from 'antd';
import FilterForm from './FilterForm';
import {FormattedMessage,formatMessage} from "umi/locale";
import DataTable from './table';

export default class UserList extends React.Component{
    render(){
        return <div className={'card-group'}>
            <Card bordered={false}>
                <FilterForm/>
            </Card>
            <Card bordered={false}>
                <DataTable/>
            </Card>
        </div>
    }
}
