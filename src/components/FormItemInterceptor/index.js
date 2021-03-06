import React, {Component} from 'react';
// import {DatePicker,TimePicker} from "antd";
import moment from "moment";
import PropTypes from 'prop-types';

function compose(list,val,action) {
    let resultVal = val;
    list.forEach(pipe=>{
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
    if(value && typeof value==='object' && value.target){
        return value.target.value;
    }
    return value;
}
function reverseObject(obj) {
    const newObj = {};
    Object.keys(obj).forEach(key=>{
        newObj[obj[key]] = key;
    });
    return newObj;
}
// 表单元素数据拦截处理器
class FormItemInterceptor extends Component {
    static propTypes = {
        pipes:PropTypes.oneOfType([PropTypes.func,PropTypes.object,PropTypes.array]).isRequired
    };

    render() {
        const {value,pipes,onChange,children} = this.props;
        const pipeList = Array.isArray(pipes) ? pipes : [pipes];
        compose(pipeList,this.props,'onRender');
        return React.cloneElement(children,{
            value:compose(pipeList,value,'input'),
            onChange(val,...args){
                return onChange(compose(pipeList,val,'output'),val,...args)
            }
        });
    }
}
// 预置处理管道
const Pipes = {
    DateString:(options={})=> ({
            // onRender({children}) {
            //     const isDateComponent = children.type === DatePicker ||
            //         children.type === DatePicker.MonthPicker ||
            //         children.type === DatePicker.RangePicker ||
            //         children.type === DatePicker.WeekPicker ||
            //         children.type === TimePicker;
            //     if(!isDateComponent)throw new TypeError('Children is not a Date component');
            // },
            input (value) {
                value = getValue(value);
                if(!value)return value;
                return moment(value);
            },
            output (value) {
                value = getValue(value);
                if(typeof options==='string'){
                    options = {format:options}
                }
                const {format='YYYY-MM-DD HH:mm:ss'} = options;
                if(!value)return value;
                if(Array.isArray(value)){
                    value = value.map(m=>m.format(format));
                }else {
                    value = value.format(format);
                }
                return value;
            }
        }),
    String:{
        input (value) {
            value = getValue(value);
            if(value == null)return value;
            return String(value);
        },
        output (value) {
            value = getValue(value);
            if(value == null)return value;
            return String(value);
        }
    },
    Number:{
        input (value) {
            value = getValue(value);
            if(value == null)return value;
            return Number(value);
        },
        output (value) {
            value = getValue(value);
            if(value == null)return value;
            return Number(value);
        }
    },
    Mapping:(map={})=>{
        const reverseMap = reverseObject(map);
        return {
            input(value) {
                value = getValue(value);
                return reverseMap[value];
            },
            output(value) {
                value = getValue(value);
                return map[value];
            }
        }
    },
    Bool2Number:(trueNumber=1,falseNumber=2)=>{
        if(isNaN(trueNumber) || isNaN(falseNumber)){
            throw new Error('Argument 1,2 should be a number');
        }
        return Pipes.Mapping({true:trueNumber,false:falseNumber});
    },
    Number2Bool:(trueNumber=1,falseNumber=2)=>{
        if(isNaN(trueNumber) || isNaN(falseNumber)){
            throw new Error('Argument 1,2 should be a number');
        }
        return Pipes.Mapping({[trueNumber]:true,[falseNumber]:false});
    }
};
FormItemInterceptor.Pipes = Pipes;

export default FormItemInterceptor;
