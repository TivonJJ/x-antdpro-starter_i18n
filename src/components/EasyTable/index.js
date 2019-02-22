'use strict';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Spin, Table } from 'antd';
import {connect} from "dva";
import './provider';
import connector from './connector';
import { FormattedMessage } from 'umi/locale';
import './style.less';

@connect(({easyTableProvider})=>({
    easyTableProvider
}))
export default class EasyTable extends React.Component{
    state={
        error:null
    };
    static propTypes={
        source:PropTypes.oneOfType([PropTypes.func,PropTypes.string]).isRequired, // 数据源
        name: PropTypes.string.isRequired, // Table的名称，provider数据池识别的键,必须唯一。
        autoFetch:PropTypes.bool, // 是否在初始化后自动加载数据
        keepData:PropTypes.bool, // 在销毁时清除Redux数据
        renderHeader:PropTypes.func, // 顶部渲染回调
        onDataLoaded: PropTypes.func,// 数据加载成功后回调
        onError: PropTypes.func,// 发生错误时回调
        onChange: PropTypes.func,// Table发生变化时回调
        before: PropTypes.any,// 表格前面的内容
        after: PropTypes.any,// 表格后面的内容
        wrappedComponentRef: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
        columns: PropTypes.array
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
                name:props.name,
                source:props.source
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
    clean(){
        this._dispatch('easyTableProvider/clean',{},false);
    }
    _dispatch(action,params,shouldCatch=true){
        this.setState({error:null});
        const pro = this.props.dispatch({
            type: action,
            payload: {
                name:this.props.name,
                ...params
            }
        });
        if(shouldCatch){
            pro.then((res)=>{
                this.props.onDataLoaded(res,action,params);
            },error=>{
                if(error instanceof Error) throw error;
                this.setState({error});
                this.props.onError(error);
            })
        }
        return pro;
    }
    handleChange=(pagination)=>{
        this.paging(pagination);
        this.props.onChange&&this.props.onChange(pagination);
    };
    render(){
        const {easyTableProvider:{page:dataPage,loading},name} = this.props;
        const {error} = this.state;
        let page = dataPage[name],
            busy = loading[name] || false;
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
