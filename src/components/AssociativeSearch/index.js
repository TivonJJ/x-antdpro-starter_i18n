"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import {Select,Spin} from 'antd';
import debounce from 'lodash.debounce';
import { isPromise } from '@/utils';
import controllable from '@/components/react-controllables';

@controllable(['value'])
export default class extends React.Component{
    static propTypes = {
        onFetch: PropTypes.func.isRequired,
        trim:PropTypes.bool,
        autoSelectFirst:PropTypes.bool,
        onReady:PropTypes.func,
        onData: PropTypes.func
    };
    static defaultProps={
        valueKey:'value',
        labelKey:'label',
        debounceWait:500,
        trim:true,
        autoSelectFirst:false
    };
    state={
        popoverVisible:false,
        data:[],
        fetching: false,
    };
    constructor(props){
        super(props);
        //异步节流时序控制
        this.lastFetchId = 0;
        const {debounceWait} = this.props;
        this.handleSearch = debounce(this.handleSearch, debounceWait);
    }
    componentDidMount(){
        const {fetchOnMount=true} = this.props;
        if(fetchOnMount)this.doFetch();
    }
    setSelectList=(data,isFetchOnBottom)=>{
        this.setState({data},()=>{
            if(!isFetchOnBottom && this.props.autoSelectFirst){
                if(data && data[0]){
                    this.props.onChange(data[0][this.props.valueKey]);
                }
            }
            if(!isFetchOnBottom){
                this.props.onReady && this.props.onReady(data);
            }
            this.props.onData&&this.props.onData(data,isFetchOnBottom);
        })
    };
    handleSearch=(value)=>{
        const {fetchOnSearch,onSearch=()=>{}} = this.props;
        if(fetchOnSearch){
            this.doFetch(value);
        }else {
            onSearch(value);
        }
    };
    handleChange=(val)=>{
        const {onChange,trim} = this.props;
        if(trim && typeof val==='string')val = val.trim();
        if(!val)this.handleSearch('');
        onChange&&onChange(val);
    };
    doFetch(filter){
        const {onFetch} = this.props;
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        if (fetchId !== this.lastFetchId)return;
        const rs = onFetch(filter);
        this.handleFetchResult(rs);
    }
    handleFetchResult=(rs,isFetchOnBottom)=>{
        if(rs===null)return;
        if(isPromise(rs)){
            this.setState({fetching:true});
            rs.then(data=>{
                this.setSelectList(data,isFetchOnBottom);
            }).finally(()=>{
                this.setState({fetching:false});
            });
        }else {
            this.setSelectList(rs,isFetchOnBottom);
        }
    };
    handlePopupScroll=({currentTarget})=>{
        const el = currentTarget.children[0];
        if(el.scrollHeight-el.scrollTop ===el.clientHeight){
            if(this.props.onScrollBottom){
                const rs = this.props.onScrollBottom();
                this.handleFetchResult(rs,true);
            }
        }
    };
    getLabel(item){
        const {labelKey} = this.props;
        if(typeof labelKey === 'function')return labelKey(item);
        return item[labelKey];
    };
    getValue(item){
        const {valueKey} = this.props;
        if(typeof valueKey === 'function')return valueKey(item);
        return item[valueKey];
    }
    getKey(item,index){
        const {itemKey,valueKey} = this.props;
        if(itemKey){
           if(typeof itemKey==='string')return itemKey;
           if(typeof itemKey==='function'){
               return itemKey(item,index);
           }
        }
        return valueKey;
    }
    render(){
        const {showSearch=true,filterOption=false,placeholder,
            value=undefined,
            allowClear = true,
            ...restProps
        } = this.props;
        let {fetching,data} = this.state;
        if('data' in this.props){
            data = this.props.data;
        }
        const hasPage = !!this.props.onScrollBottom;
        const options = data.map((item,index) => <Select.Option key={this.getKey(item,index)} value={this.getValue(item)}>{this.getLabel(item)}</Select.Option>);
        const loading = fetching?
            <Select.Option key={'$loading'} disabled><Spin size={'small'}/></Select.Option>:null;
        if(hasPage){
            options.unshift(loading);
        }else {
            options.push(loading);
        }
        return <Select
            {...restProps}
            value={value}
            showSearch={showSearch}
            allowClear={allowClear}
            placeholder={placeholder}
            filterOption={filterOption}
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            onPopupScroll={this.handlePopupScroll}
        >
            {options}
        </Select>
    }
}
