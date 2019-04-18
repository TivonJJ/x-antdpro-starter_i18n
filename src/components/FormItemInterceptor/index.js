"use strict";
import React, {Component} from 'react';
import {DatePicker,TimePicker} from "antd";
import moment from "moment";
import PropTypes from 'prop-types';

// 表单元素数据拦截处理器
class FormItemInterceptor extends Component {
    static propTypes = {
        pipes:PropTypes.oneOfType([PropTypes.func,PropTypes.object,PropTypes.array]).isRequired
    };
    render() {
        const {value,pipes,onChange,children} = this.props;
        let pipeList = Array.isArray(pipes) ? pipes : [pipes];
        compose(pipeList,this.props,'onRender');
        return React.cloneElement(children,{
            value:compose(pipeList,value,'input'),
            onChange(value,...args){
                return onChange(compose(pipeList,value,'output'),value,...args)
            }
        });
    }
}
// 预置处理管道
const Pipes = {
    DateString:(options={})=> {
        return {
            // onRender:function ({children}) {
            //     const isDateComponent = children.type === DatePicker ||
            //         children.type === DatePicker.MonthPicker ||
            //         children.type === DatePicker.RangePicker ||
            //         children.type === DatePicker.WeekPicker ||
            //         children.type === TimePicker;
            //     if(!isDateComponent)throw new TypeError('Children is not a Date component');
            // },
            input:function (value) {
                value = getValue(value);
                if(!value)return value;
                return moment(value);
            },
            output:function (value) {
                value = getValue(value);
                if(typeof options==='string'){
                    options = {format:options}
                }
                let {format='YYYY-MM-DD HH:mm:ss'} = options;
                if(!value)return value;
                if(Array.isArray(value)){
                    value = value.map(m=>m.format(format));
                }else {
                    value = value.format(format);
                }
                return value;
            }
        }
    },
    String:{
        input:function (value) {
            value = getValue(value);
            if(null == value)return value;
            return String(value);
        },
        output:function (value) {
            value = getValue(value);
            if(null == value)return value;
            return String(value);
        }
    },
    Number:{
        input:function (value) {
            value = getValue(value);
            if(null == value)return value;
            return Number(value);
        },
        output:function (value) {
            value = getValue(value);
            if(null == value)return value;
            return Number(value);
        }
    },
    Mapping:(map={})=>{
        const reverseMap = reverseObject(map);
        return {
            input: function(value) {
                value = getValue(value);
                return reverseMap[value];
            },
            output: function(value) {
                value = getValue(value);
                return map[value];
            }
        }
    },
    Bool2Number:(trueNumber=1,falseNumber=2)=>{
        if(isNaN(trueNumber) || isNaN(falseNumber))throw 'Argument 1,2 should be a number';
        return Pipes.Mapping({true:trueNumber,false:falseNumber});
    },
    Number2Bool:(trueNumber=1,falseNumber=2)=>{
        if(isNaN(trueNumber) || isNaN(falseNumber))throw 'Argument 1,2 should be a number';
        return Pipes.Mapping({[trueNumber]:true,[falseNumber]:false});
    }
};
FormItemInterceptor.Pipes = Pipes;

function compose(list,val,action) {
    let resultVal = val;
    list.map(pipe=>{
        if(typeof pipe === 'function'){
            pipe = pipe();
        }
        if(pipe[action]){
            resultVal = pipe[action](resultVal);
        }
    });
    return resultVal;
}

function getValue(value) {
    if(value && typeof value==='object' && value.target)return value.target.value;
    return value;
}
function reverseObject(obj) {
    const newObj = {};
    Object.keys(obj).map(key=>{
        newObj[obj[key]] = key;
    });
    return newObj;
}

export default FormItemInterceptor;
