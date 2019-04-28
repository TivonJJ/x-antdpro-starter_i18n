'use strict';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Spin, Table } from 'antd';
import {connect} from "dva";
import './provider';
import connector from './connector';
import { FormattedMessage } from 'umi/locale';
import './style.less';
import diff from 'deep-diff';

@connect(({easyTableProvider})=>({
    easyTableProvider
}))
export default class EasyTable extends React.Component{
    static propTypes={
        source:PropTypes.oneOfType([PropTypes.func,PropTypes.string]).isRequired, // 数据源
        name: PropTypes.string.isRequired, // Table的名称，provider数据池识别的键,必须唯一。
        autoFetch:PropTypes.bool, // 是否在初始化后自动加载数据
        keepData:PropTypes.bool, // 持久保存Redux数据
        fixedParams: PropTypes.object, // 请求固定携带的附加参数
        renderHeader:PropTypes.func, // 顶部渲染回调
        onDataLoaded: PropTypes.func,// 数据加载成功后回调
        onError: PropTypes.func,// 发生错误时回调
        onChange: PropTypes.func,// Table发生变化时回调
        before: PropTypes.any,// 表格前面的内容
        after: PropTypes.any,// 表格后面的内容
        wrappedComponentRef: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
        columns: PropTypes.array,
    };
    static defaultProps={
        autoFetch: false,
        keepData: false,
        renderHeader:(title,extra)=>{
            return <div className={'comp-easytable_header'}>
                <div className={'comp-easytable_header_title'}>{title}</div>
                <div className={'comp-easytable_header_extra'}>{extra}</div>
            </div>
        },
        onDataLoaded(){},
        onError(){}
    };
    static connect = connector;
    constructor(props){
        props.dispatch({
            type:'easyTableProvider/_initialize',
            payload:{
                name: props.name,
                source: props.source,
                onDataLoaded: props.onDataLoaded,
                onError: props.onError,
                fixedParams: props.fixedParams
            }
        });
        if(typeof props.name !== 'string'){
            throw new ReferenceError('Argument [name] require string,But got a ' + name);
        }
        super(props);
    }
    componentDidMount(){
        const {easyTableProvider:{page:dataPage},name,keepData,autoFetch,wrappedComponentRef} = this.props;
        if(autoFetch && !(keepData && dataPage[name] && dataPage[name].total>0)){
            this.fetch()
        }
        if(wrappedComponentRef){
            wrappedComponentRef(this);
        }
    }
    componentWillUnmount() {
        if(!this.props.keepData){
            this.clean();
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.name !== nextProps.name){
            throw new Error('The name of the EasyTable cannot be changed，You can switch between multiple tables')
        }
        const changedProps = [];
        ['source', 'onDataLoaded', 'onError'].map(key=>{
            if(this.props[key] !== nextProps[key]){
                changedProps.push(key)
            }
        });
        ['fixedParams'].map(key=>{
            if(diff(this.props[key],nextProps[key])){
                changedProps.push(key)
            }
        });
        if(changedProps.length>0){
            let changeValue = {};
            changedProps.map(key=>{
                if(key in nextProps){
                    changeValue[key] = nextProps[key];
                }
            });
            this.props.dispatch({
                type:'easyTableProvider/_update',
                payload:{
                    name: this.props.name,
                    ...changeValue
                }
            });
        }
    }

    fetch=(params,pagination)=>{
        return this._dispatch('easyTableProvider/fetch',{
            params,
            pagination
        });
    };
    refresh=(pagination)=>{
        return this._dispatch('easyTableProvider/refresh',{pagination});
    };
    paging=(pagination)=>{
        return this._dispatch('easyTableProvider/paging',{pagination});
    };
    search=(params)=>{
        return this._dispatch('easyTableProvider/search',{params});
    };
    clean(){
        this._dispatch('easyTableProvider/clean',{});
    }
    _dispatch(action,params){
        return this.props.dispatch({
            type: action,
            payload: {
                name:this.props.name,
                ...params
            }
        });
    }
    handleChange=(pagination)=>{
        this.paging(pagination);
        this.props.onChange&&this.props.onChange(pagination);
    };
    render(){
        const {easyTableProvider:{page:dataPage,loading,errors},name} = this.props;
        let page = dataPage[name],
            busy = loading[name] || false,
            error = errors[name];
        let {title=(page)=>(
            <FormattedMessage id={'Common.pagination.total'} values={{total:page.total}}/>
        ),extra,className,style,renderHeader,before,after,...restProps} = this.props;
        if(title===false)title = null;
        if(typeof title === 'function')title = title(page);
        return <div className={className} style={style}>
            <Spin spinning={busy}>
                {renderHeader(title,extra,page)}
                {error?
                    <Alert
                        message={error.message}
                        type="error"
                        description={<div className={'text-center gutter-top'}>
                            <Button onClick={this.refresh}>
                                <FormattedMessage id={'Common.button.retry'}/>
                            </Button>
                        </div>}
                    />
                    :
                    <Fragment>
                        {before!=null && <div className={'comp-easytable_before'}>{before}</div>}
                        <Table {...restProps} pagination={page} dataSource={page.data} onChange={this.handleChange}/>
                        {after!=null && <div className={'comp-easytable_after'}>{after}</div>}
                    </Fragment>
                }
            </Spin>
        </div>
    }
}
