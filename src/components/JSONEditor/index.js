'use strict';
import React from 'react';
import {Modal} from 'antd';
import controllable from "@/components/react-controllables";
import Editor from './Editor';
import ace from 'brace';
import classnames from 'classnames';
import 'brace/mode/json';
import 'brace/theme/github';
import diff from 'deep-diff';

@controllable(['value'])
export default class JSONEditor extends React.Component{
    static defaultProps = {
        mode:'code',
    };
    componentWillReceiveProps(nextProps, nextContext) {
        if(this.currentVal !== nextProps.value){
            if(!diff(this.props.value,this.currentVal) && diff(this.currentVal,nextProps.value)){
                let value = this.parseValue(nextProps.value);
                this.editor.jsonEditor.set(value);
                this.currentVal = value;
            }
        }
    }
    handleError=(err)=>{
        Modal.error({
            title:'ERROR',
            content:err.toString()
        })
    };
    onRef=(ref)=>{
        const {editorRef} = this.props;
        if(editorRef)editorRef(ref);
        if(ref){
            this.editor = ref;
        }else {
            this.editor = null;
        }
    };
    handleChange=(val)=>{
        this.currentVal = val;
        this.props.onChange(val);
    };
    handleEditable=(edit)=>{
        if(this.props.disabled)return false;
        return edit;
    };
    parseValue=(value)=>{
        // if(typeof value === 'string'){
        //     try{
        //         value = JSON.parse(value);
        //     }catch (e) {
        //         value = {
        //             jsonParseError:e.message,
        //             data:value
        //         }
        //     }
        // }
        if(null==value)value = '';
        return value;
    };
    render(){
        let {value,disabled,editorRef,id,width,height,className,style,mode,...rest} = this.props;
        value = this.parseValue(value);
        return <div className={classnames('comp-jsoneditor', {'disabled': disabled},className)}
                    style={{width,height,...style}}
                    id={id}>
            <Editor ace={ace}
                    theme="ace/theme/github"
                    allowedModes={['code', 'form', 'text', 'tree', 'view']}
                    {...rest}
                    mode={mode}
                    value={value}
                    onError={this.handleError}
                    onChange={this.handleChange}
                    onEditable={this.handleEditable}
                    ref={this.onRef}/>
        </div>
    }
}
