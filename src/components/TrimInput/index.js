'use strict';
import React from 'react';
import { Input } from 'antd';

export default class extends React.Component{
    handleChange=(evt)=>{
        this.props.onChange(evt.currentTarget.value.trim());
    };
    render(){
        return <Input {...this.props} onChange={this.handleChange}/>
    }
}
