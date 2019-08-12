import React from 'react';
import { Tooltip } from 'antd';
import Task from './Task';

const StatusIconMap = {
    '/task':Task
};

export const getComponent = (menu,props,title)=>{
    const Component = StatusIconMap[menu.route];
    if(Component){
        let comp = <Component menu={menu} location={props.location} title={title}/>;
        const options = Component.Options || {};
        if(!options.noTitleTips){
            comp = (
                <Tooltip placement={"bottom"} title={title}>
                    {comp}
                </Tooltip>
            )
        }
        return comp;
    }
    return null;
};
