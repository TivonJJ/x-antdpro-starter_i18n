import React from 'react';
import { Avatar, List } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';

export default class NoticeList extends React.Component{
    static defaultProps={
        data:[],
        onItemClick:()=>{},
        emptyText:'暂无数据',
        emptyImage:'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
    };
    render(){
        const {data,emptyText,emptyImage,onItemClick} = this.props;
        if (data.length === 0) {
            return (
                <div className={styles.notFound}>
                    {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
                    <div>{emptyText}</div>
                </div>
            );
        }
        return <div>
            <List className={classNames(styles.list,'x-scroll')} id={'task-list-scroll'}>
                {data.map((item, i) => {
                    const itemCls = classNames(styles.item, {
                        [styles.read]: item.read,
                    });
                    let avatar = item.avatar;
                    if(typeof avatar === 'string'){
                        avatar = <Avatar className={styles.avatar} src={item.avatar} />
                    }
                    return (
                        <List.Item className={itemCls} key={item.key || i} onClick={(evt) => onItemClick(item,evt)}>
                            <a className={styles.itemLink} href={item.link} target={'_blank'}>
                                <List.Item.Meta
                                    className={styles.meta}
                                    avatar={avatar}
                                    title={
                                        <div className={styles.title}>
                                            {item.title}
                                            <div className={styles.extra}>{item.extra}</div>
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <div className={styles.description} title={item.description}>
                                                {item.description}
                                            </div>
                                            <div className={styles.datetime}>{item.datetime}</div>
                                        </div>
                                    }
                                />
                            </a>
                        </List.Item>
                    );
                })}
            </List>
        </div>
    }
}
