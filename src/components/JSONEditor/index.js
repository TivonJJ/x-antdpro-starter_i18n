'use strict';
import React from 'react';
import JSONInput from 'react-json-editor-ajrm';

const theme = {
    style:{
        outerBox:{
            lineHeight: 1.5
        }
    }
};

export default class JSONEditor extends React.Component{
    static formatValidator = function(rule, value, callback){
        const errors = [];
        if(value === '$$ERROR$$')errors.push(new Error('JSON format error'));
        callback(errors);
    };
    static defaultProps = {
        onKeyPressUpdate:false,
    };
    handleChange=(val)=>{
        this.props.onChange(val.error?'$$ERROR$$':val.json);
    };
    render(){
        const {value,disabled,...rest} = this.props;
        let placeholder = undefined;
        if(value && value !== '$$ERROR$$' && typeof value === 'string'){
            try{
                placeholder = JSON.parse(value);
            }catch (e) {
                console.warn('json data error');
            }
        }
        return <JSONInput {...rest}
                          {...theme}
                          viewOnly={disabled}
                          placeholder={placeholder}
                          onChange={this.handleChange}/>
    }
}
