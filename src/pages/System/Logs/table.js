import React from 'react';
import {Card} from 'antd';
import {FormattedMessage, formatMessage} from 'umi/locale'
import {ServicePlatform} from '@/constants/logs';
import DateFormat from '@/components/DateFormat';
import EasyTable from '@/components/EasyTable';
import { getLogs } from '@/services/basic';
import Detail from './detail';
import style from './style.less'

export default class LogsTable extends React.Component {
    showDetailView = (item) => {
        this.detail.show(item);
    };

    render() {
        const columns = [
            {
                title: formatMessage({id: 'Page.system.logs.label.operationTime'}),
                dataIndex: 'create_time',
                render(date){
                    return <DateFormat date={date}/>
                }
            }, {
                title: formatMessage({id: 'Page.system.logs.label.platform'}),
                dataIndex: 'platform',
                render: (id) => formatMessage({id: ServicePlatform[id]})
            }, {
                title: formatMessage({id: 'Page.system.logs.label.operationType'}),
                dataIndex: 'operation'
            }, {
                title: formatMessage({id: 'Page.system.logs.label.operator'}),
                dataIndex: 'operator_name'
            }, {
                title: formatMessage({id: 'Page.system.logs.label.logNote'}),
                dataIndex: 'description'
            }, {
                title: formatMessage({id: 'Page.system.logs.label.operation'}),
                render: (item) => (
                    <a onClick={() => this.showDetailView(item)}>
                        <FormattedMessage id={'Common.status.detail'}/>
                    </a>
                )
            },
        ];
        return (
            <Card bordered={false} className={style.layoutVerticalSpace}>
                <EasyTable
                    name={'logsDataTable'}
                    columns={columns}
                    rowKey={'id'}
                    autoFetch
                    source={getLogs}
                />
                <Detail ref={ref=>{this.detail = ref}}/>
            </Card>
        );
    }
}
