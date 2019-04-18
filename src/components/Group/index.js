import React, {Component} from 'react';
import {Icon} from "antd";
import './index.less';
import PropsTypes from "prop-types";

class Group extends Component {
    static propTypes={
        icon: PropsTypes.oneOfType([PropsTypes.element,PropsTypes.string]),
        title: PropsTypes.any,
        extra: PropsTypes.any
    };
    render() {
        let {icon,title,children,extra,className,style} = this.props;
        if(typeof icon === 'string'){
            icon = <Icon type={icon}/>
        }
        return (
            <div className={`comp-group ${className || ''}`} style={style}>
                <div className={'comp-group_header'}>
                    <div className={'comp-group-header_title'}>
                        {icon&&<span className={'comp-group_header_icon'}>{icon}</span>}
                        <span className={'comp-group-header_text'}>{title}</span>
                    </div>
                    <div className={'comp-group-header_extra'}>{extra}</div>
                </div>
                <div className={'comp-group_content'}>
                    {children}
                </div>
            </div>
        );
    }
}

export default Group;
