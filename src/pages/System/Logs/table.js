import React from 'react';
import {Card} from 'antd';
import style from './style.less'
import {connect} from 'dva'
import {FormattedMessage, formatMessage} from 'umi/locale'
import {ServicePlatform} from '@/constants/logs';
import DateFormat from '@/components/DateFormat';
import EasyTable from '@/components/EasyTable';

@connect(({logs}) => {
    return {
        query: logs.query
    }
})
export default class LogFilterTable extends React.Component {
    showDetailView = (item) => {
        this.props.dispatch({
            type: 'logs/changeDetailViewData',
            payload: item
        })
    }

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
                render: (id, item) => formatMessage({id: ServicePlatform[id]})
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
                render: (item) => <a onClick={() => this.showDetailView(item)}><FormattedMessage
                    id={'Common.status.detail'}/></a>
            },
        ]
        return (
            <Card bordered={false} className={style.layoutVerticalSpace}>
                <EasyTable name={'logsDataTable'} columns={columns} source={'basis/oplog/list'}/>
            </Card>
        );
    }
}
