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

    static defaultProps = {
        icon:null,
        title:null,
        extra:null
    };

    render() {
        const {title,children,extra,className,style} = this.props;
        let {icon} = this.props;
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
