import React from 'react';
import { Badge, Table } from 'antd';
import classnames from 'classnames';
import styles from './style.less';

export default class RankingTable extends React.PureComponent{
    static defaultProps={
        max:10,//仅展示的Top条数
        top:3//点亮显示的Top条数
    };
    render() {
        let {columns=[],data=[],max,top,rowKey=(item,index)=>index} = this.props;
        data = data.slice(0,max);
        columns = [{
            title: '',
            width: 20,
            key:'__rank_no__',
            render:(name,item,index)=>{
                const pos = index + 1;
                return <Badge count={pos}
                              className={classnames(
                                  styles.topBadge,
                                  {[styles.light]:pos<=top})
                              }/>
            }
        }].concat(columns);
        return (
            <Table columns={columns}
                   className={styles.table}
                   pagination={false}
                   rowKey={rowKey}
                   dataSource={data}/>
        )
    }
}
