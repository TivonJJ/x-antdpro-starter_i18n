"use strict";
import React from 'react';
import { Icon, Card, Pagination, Tag, Spin,notification } from 'antd';
import styles from '../../index.less';
import {connect} from "dva";
import NoticeIcon from '@/components/NoticeIcon';
import {FormattedMessage,formatMessage} from "umi/locale";
import { getPublicPath } from '@/utils';
import DateFormat from "@/components/DateFormat";

export const Status = {
    0:{name:<FormattedMessage id={'Common.status.processing'}/>,tagColor:'blue'},
    1:{name:<FormattedMessage id={'Common.status.success'}/>,tagColor:'green'},
    2:{name:<FormattedMessage id={'Common.status.failed'}/>,tagColor:'magenta'}
};
export const Types = {
    1:{name:<FormattedMessage id={'Common.message.import'}/>,icon:getPublicPath('img/icon-task_import.png')},
    2:{name:<FormattedMessage id={'Common.message.export'}/>,icon:getPublicPath('img/icon-task_export.png')},
    3:{name:<FormattedMessage id={'Common.message.timing'}/>,icon:getPublicPath('img/icon-task_alarm.png')},
    4:{name:<FormattedMessage id={'Common.message.other'}/>,icon:getPublicPath('img/icon-task_other.png')}
};

@connect(({task,loading}) => ({
    task,
    fetching:loading.effects['task/fetch']
}))
export default class Task extends React.Component{
    static Options={
        noTitleTips:true
    };
    fetchTasks=()=>{
        if(this.props.fetching)return;
        this.props.dispatch({
            type:'task/fetch',
            payload:{
                page:this.page
            }
        }).then(()=>{
            // document.getElementById('task-list-scroll').scrollTop = 0;
        },err=>{
            notification.error({
                message:formatMessage({id:'Common.message.fetchFail'}),
                description:err.message
            })
        });
    };
    handlePageChange=(page,pageSize)=>{
        this.page = {
            current:page,
            page_size:pageSize
        };
        this.fetchTasks()
    };
    handlePopUpChange=(visible)=>{
        if(visible){
            this.fetchTasks();
            // 清除气泡
            this.props.dispatch({
                type:'task/changeState',
                payload:{
                    hasUnread:false
                }
            })
        }
    };
    render(){
        const {menu,task,fetching=false,title} = this.props;
        const {tasksPage} = task;
        const noticeList = [];
        tasksPage.data.map(item=>{
            const statusTag = Status[item.status];
            if(!statusTag)return;
            const type = Types[item.task_type];
            noticeList.push({
                source:item,
                link:item.file_url,
                avatar:type.icon,
                title:item.task_name,
                description:item.description,
                datetime:<DateFormat date={item.create_time}/>,
                extra: <Tag color={statusTag.tagColor}>{statusTag.name}</Tag>
            })
        });
        return <NoticeIcon
            icon={menu.icon}
            dot={task.hasUnread}
            className={styles.action}
            onPopupVisibleChange={this.handlePopUpChange}>
            <Card title={title}
                  className={styles.noticeCard}
                  extra={<a onClick={this.fetchTasks}><Icon type={'reload'} spin={fetching}/></a>}>
                <Spin spinning={fetching}>
                    <NoticeIcon.List
                        data={noticeList}
                        emptyText={<FormattedMessage id={'Component.statusIcon.task.emptyText'}/>}>
                    </NoticeIcon.List>
                    <div className={styles.footer}>
                        <Pagination {...tasksPage}
                                    onChange={this.handlePageChange}
                                    showTotal={total=><FormattedMessage id={'Common.pagination.total'} values={{total}}/>}
                        />
                    </div>
                </Spin>
            </Card>
        </NoticeIcon>;
    }
}
