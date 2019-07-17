import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Spin, Table } from 'antd';
import {connect} from "dva";
import './provider';
import { FormattedMessage } from 'umi/locale';
import './style.less';
import diff from 'deep-diff';
import connector from './connector';

@connect(({easyTableProvider})=>({
    easyTableProvider
}))
class EasyTable extends React.Component{
    static propTypes={
        source:PropTypes.oneOfType([PropTypes.func,PropTypes.string]).isRequired, // 数据源
        name: PropTypes.string.isRequired, // Table的名称，provider数据池识别的键,必须唯一。
        autoFetch:PropTypes.bool, // 是否在初始化后自动加载数据
        keepData:PropTypes.bool, // 持久保存Redux数据
        fixedParams: PropTypes.object, // 请求固定携带的附加参数
        title: PropTypes.any, // 标题
        renderHeader:PropTypes.func, // 顶部渲染回调
        onDataLoaded: PropTypes.func,// 数据加载成功后回调
        onError: PropTypes.func,// 发生错误时回调
        onChange: PropTypes.func,// Table发生变化时回调
        before: PropTypes.any,// 表格前面的内容
        after: PropTypes.any,// 表格后面的内容
        wrappedComponentRef: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
        columns: PropTypes.array,
        pageProps: PropTypes.object,// Page的参数属性
        dataProp: PropTypes.string, // data取值的属性
    };

    static defaultProps={
        autoFetch: false,
        keepData: false,
        fixedParams:null,
        title:(page)=>(
            <FormattedMessage id={'Common.pagination.total'} values={{total:page.total}}/>
        ),
        renderHeader:(title,extra)=>(
            <div className={'comp-easytable_header'}>
                <div className={'comp-easytable_header_title'}>{title}</div>
                <div className={'comp-easytable_header_extra'}>{extra}</div>
            </div>
        ),
        onDataLoaded(){},
        onError(){},
        onChange(){},
        before:null,
        after:null,
        wrappedComponentRef:undefined,
        columns:[],
        pageProps:{
            current: 'page_num',
            pageSize: 'page_size',
            total: 'total'
        },
        dataProp:'data'
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
                fixedParams: props.fixedParams,
                pageProps: props.pageProps,
                dataProp: props.dataProp,
            }
        });
        if(typeof props.name !== 'string'){
            throw new ReferenceError(`Argument [name] require string,But got a ${  name}`);
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

    componentWillReceiveProps(nextProps) {
        if(this.props.name !== nextProps.name){
            throw new Error('The name of the EasyTable cannot be changed，You can switch between multiple tables')
        }
        const changedProps = [];
        ['source', 'onDataLoaded', 'onError'].forEach(key=>{
            if(this.props[key] !== nextProps[key]){
                changedProps.push(key)
            }
        });
        ['fixedParams'].forEach(key=>{
            if(diff(this.props[key],nextProps[key])){
                changedProps.push(key)
            }
        });
        if(changedProps.length>0){
            const changeValue = {};
            changedProps.forEach(key=>{
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

    componentWillUnmount=()=> {
        if(!this.props.keepData){
            this.clean();
        }
    };

    fetch=(params,pagination)=>{
        this._dispatch('easyTableProvider/fetch',{
            params,
            pagination
        })
    };

    refresh=(pagination)=>this._dispatch('easyTableProvider/refresh',{pagination});

    paging=(pagination)=>this._dispatch('easyTableProvider/paging',{pagination});

    search=(params)=>this._dispatch('easyTableProvider/search',{params});

    getProviderState=()=>{
        const {easyTableProvider,name} = this.props;
        return {
            errors: easyTableProvider.errors[name],
            fixedParams: easyTableProvider.fixedParams[name],
            params: easyTableProvider.params[name],
            loading: easyTableProvider.loading[name],
            page: easyTableProvider.page[name],
            pageProps: easyTableProvider.pageProps[name],
            dataProp: easyTableProvider.dataProp[name],
        }
    };

    clean=()=>{
        this._dispatch('easyTableProvider/clean',{});
    };

    _dispatch = (action, params) => (
        this.props.dispatch({
            type: action,
            payload: {
                name: this.props.name,
                ...params,
            },
        })
    );

    handleChange=(pagination)=>{
        this.paging(pagination);
        this.props.onChange(pagination);
    };

    render(){
        const {easyTableProvider:{page:dataPage,loading,errors},name} = this.props;
        const page = dataPage[name];
            const busy = loading[name] || false;
            const error = errors[name];
        const {title:propTitle,extra,className,style,renderHeader,before,after,...restProps} = this.props;
        let title = propTitle;
        if(title===false)title = null;
        if(typeof title === 'function')title = title(page);
        return <div className={className} style={style}>
            <Spin spinning={busy}>
                {renderHeader(title,extra,page)}
                {error?
                    <Alert
                        message={error.message}
                        type={"error"}
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

export default EasyTable;
