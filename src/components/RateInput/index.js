'use strict';
import React from 'react';
import { InputNumber } from 'antd';

export default class extends React.Component{
    static defaultProps={
        min:0
    };
    limiter=(value)=>{
        if(null==value)return value;
        const match = String(value).match(/^\d+(?:\.\d{0,2})?/);
        return match?match.toString():value;
    };
    render(){
        return <InputNumber {...this.props}
                            formatter={this.limiter}
                            parser={this.limiter}
        />
    }
}
