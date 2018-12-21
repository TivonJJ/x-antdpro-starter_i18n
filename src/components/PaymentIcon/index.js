'use strict';
import React from 'react';
require('./index.less');
import classnames from 'classnames';
import PropTypes from "prop-types";
import { Icon, Tooltip } from 'antd';

const ICON_POS_ARRAY = [
    ['M02','M03','M04','M01']
];
const CODE_POS_MAP = (function() {
    const map = {};
    ICON_POS_ARRAY.map((row,y)=>{
        row.map((item,x)=>{
            map[item] = [x,y]
        })
    });
    return map;
})();

export default class extends React.Component{
    static propTypes = {
        code: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        size: PropTypes.number,
        className: PropTypes.string,
        style: PropTypes.shape({}),
    };
    render(){
        const {className,style,title,code,size=20} = this.props;
        const iconPosition = CODE_POS_MAP[code];
        let x=0,
            y=0;
        if(iconPosition){
            x = -(iconPosition[0] * size);
            y = -(iconPosition[1] * size);
        }
        return <Tooltip title={title}>
            <span className={classnames('comp-payment_icon_item',{'no-icon':!iconPosition},className)} style={
                {
                    ...style,
                    width:size,
                    height:size,
                    backgroundPosition:`${x}px ${y}px`
                }
            }>
                {iconPosition?null:<Icon type="question-circle-o" style={{color:'#faad14',fontSize:18}}/>}
            </span>
        </Tooltip>
    }
}
