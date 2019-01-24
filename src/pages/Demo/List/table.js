import React, { Component } from 'react';
import Amount from '@/components/Amount';
import { getList } from '@/services/demo';
import Link from 'umi/link';
import { Badge, Button } from 'antd';
import {formatMessage} from 'umi/locale';
import EasyTable from '@/components/EasyTable';

class Table extends Component {
    columns=[
        {
            title:formatMessage({id:'Model.demo.no'}),
            dataIndex:'no',
            render(no,item){
                return <Badge status={item.status == 1 ? 'success' : 'default'}
                              text={<Link to={`/demo/list/${no}`}>{no}</Link>}/>
            }
        },
        {
            title:formatMessage({id:'Model.demo.name'}),
            dataIndex:"name"
        },
        {
            title:formatMessage({id:'Model.demo.amount'}),
            dataIndex: 'amount',
            render(amount){
                return <Amount value={amount}/>
            }
        }
    ];
    render() {
        return (
            <EasyTable
                autoFetch
                name={'demoTable'}
                extra={<Link to={'/demo/list/new'}>
                    <Button type={'primary'}>{formatMessage({ id: 'Common.message.add' })}</Button>
                </Link>}
                source={getList}
                rowKey={'no'}
                columns={this.columns}/>
        );
    }
}

export default Table;
