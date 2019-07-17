import React, { Component } from 'react';
import EasyTable from '@/components/EasyTable';
import Amount from '@/components/Amount';
import { getList } from '@/services/demo';
import Link from 'umi/link';
import {Alert, Badge, Button} from 'antd';
import {formatMessage} from 'umi/locale';

@EasyTable.connect(({demoKeepTable})=>({
    demoKeepTable
}))
class Table extends Component {
    columns=[
        {
            title:formatMessage({id:'Model.demo.no'}),
            dataIndex:'no',
            render(no,item){
                return (
                    <Badge
                        status={item.status == 1 ? 'success' : 'default'}
                        text={no}
                    />
                )
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
                return <Amount value={amount} />
            }
        }
    ];

    reload=()=>{
        // this.dataTable.reload(); Ref调用
        this.props.demoKeepTable.refresh();
    };

    goPage=(num)=>{
        this.props.demoKeepTable.paging({current:num});
    };

    render() {
        return (
            <div>
                <div className={'gutter-bottom_lg'}>
                    <Alert message={formatMessage({id:'Page.demo.keepListTip'})} />
                </div>
                <EasyTable
                    // wrappedComponentRef={ref=>this.dataTable=ref}
                    name={'demoKeepTable'}
                    keepData
                    autoFetch
                    extra={<Link to={'/demo/list/new'}>
                        <Button type={'primary'}>{formatMessage({ id: 'Common.message.add' })}</Button>
                           </Link>}
                    source={getList}
                    rowKey={'no'}
                    columns={this.columns}
                />
            </div>
        );
    }
}

export default Table;
