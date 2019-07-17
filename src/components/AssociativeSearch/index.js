import React from 'react';
import PropTypes from 'prop-types';
import {Select,Spin} from 'antd';
import debounce from 'lodash.debounce';
import { isPromise } from '@/utils';
import controllable from '@/components/react-controllables';

export default
@controllable(['value'])
class extends React.Component{
    static propTypes = {
        onFetch: PropTypes.func.isRequired,
        trim:PropTypes.bool,
        autoSelectFirst:PropTypes.bool,
        valueKey: PropTypes.oneOfType([PropTypes.string,PropTypes.func]),
        labelKey: PropTypes.oneOfType([PropTypes.string,PropTypes.func]),
        debounceWait: PropTypes.number,
        onReady:PropTypes.func,
        onData: PropTypes.func,
        optionProps: PropTypes.oneOfType([PropTypes.object,PropTypes.func])
    };

    static defaultProps={
        valueKey:'value',
        labelKey:'label',
        debounceWait:500,
        trim:true,
        autoSelectFirst:false,
        onReady(){},
        onData(){},
        optionProps:null
    };

    state={
        data:[],
        fetching: false,
    };

    hasFoundItems=false;

    lastData=[];

    constructor(props){
        super(props);
        // 异步节流时序控制
        this.lastFetchId = 0;
        const {debounceWait} = this.props;
        this.handleSearch = debounce(this.handleSearch, debounceWait);
    }

    static getDerivedStateFromProps(props, state) {
        const { data } = state;
        if ('data' in props && props.data !== data) {
            return {
                data: props.data,
            };
        }
        return null;
    }

    componentDidMount(){
        const {fetchOnMount=true} = this.props;
        if(fetchOnMount)this.doFetch();
    }

    getLabel(item){
        const {labelKey} = this.props;
        if(typeof labelKey === 'function')return labelKey(item);
        return item[labelKey];
    }

    getValue(item){
        const {valueKey} = this.props;
        let value = item[valueKey];
        if(typeof valueKey === 'function'){
            value = valueKey(item);
        }
        return value;
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

    setSelectList=(data,isFetchOnBottom)=>{
        this.setState({data},()=>{
            if(!isFetchOnBottom && this.props.autoSelectFirst){
                if(data && data[0]){
                    const firstItem = data[0];
                    let value = this.getValue(firstItem);
                    if(this.props.labelInValue){
                        value = {key:value,label:this.getLabel(firstItem)};
                    }
                    this.props.onChange(value,data[0]);
                }
            }
            if(!isFetchOnBottom){
                this.props.onReady(data);
            }
            this.props.onData(data,isFetchOnBottom);
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

    handleChange=(val,option)=>{
        const {onChange,trim} = this.props;
        if(trim && typeof val==='string')val = val.trim();
        onChange&&onChange(val,this.getDataByValue(val),option);
    };

    getDataByValue=(val)=>{
        if(!val)return null;
        const {data} = this.state;
        const getFullData=(value)=>data.find(item=>this.getValue(item)===value);
        if(Array.isArray(val)){
            return val.map(getFullData)
        }
            return getFullData(val)
        
    };

    doFetch=(filter)=>{
        const {onFetch} = this.props;
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        if (fetchId !== this.lastFetchId)return;
        const rs = onFetch(filter);
        this.lastData = this.state.data;
        this.handleFetchResult(rs).then(data=>{
            this.hasFoundItems = data && data.length > 0;
        },err=>{
            console.warn(err);
        });
    };

    handleFetchResult=(rs,isFetchOnBottom)=>(
        new Promise((resolve, reject) => {
            if(rs===null){
                resolve([]);
                return;
            }
            if(isPromise(rs)){
                this.setState({fetching:true});
                rs.then(data=>{
                    this.setSelectList(data,isFetchOnBottom);
                    resolve(data);
                },reject).finally(()=>{
                    this.setState({fetching:false});
                });
            }else {
                this.setSelectList(rs,isFetchOnBottom);
                resolve(rs);
            }
        })
    );

    handlePopupScroll=({currentTarget})=>{
        const el = currentTarget.children[0];
        if(el.scrollHeight-el.scrollTop ===el.clientHeight){
            if(this.props.onScrollBottom){
                const rs = this.props.onScrollBottom();
                this.handleFetchResult(rs,true);
            }
        }
    };

    handleBlur=(evt)=>{
        if(!this.hasFoundItems){
            setTimeout(()=>{
                this.setSelectList(this.lastData)
            })
        }
        this.props.onBlur && this.props.onBlur(evt);
    };

    render(){
        const {showSearch=true,filterOption=false,placeholder,
            value=undefined,
            allowClear = true,
            optionProps,
            ...restProps
        } = this.props;
        const {fetching,data} = this.state;
        const hasPage = !!this.props.onScrollBottom;
        const options = data.map((item,index) => {
            let extProps = {};
            if(optionProps){
                if(typeof optionProps === 'function'){
                    extProps = optionProps(item,index);
                }else if(typeof optionProps==='object'){
                    extProps = optionProps;
                }
            }
            return (
                <Select.Option
                    key={this.getKey(item,index)}
                    value={this.getValue(item)}
                    {...extProps}
                >
                    {this.getLabel(item)}
                </Select.Option>
            )
        });
        const loading = fetching ?
            (
                <Select.Option key={'$loading'} disabled>
                    <Spin size={'small'}/>
                </Select.Option>
            )
            :
            null;
        if(hasPage && loading){
            options.unshift(loading);
        }else {
            options.push(loading);
        }
        return (
            <Select
                {...restProps}
                value={value}
                showSearch={showSearch}
                allowClear={allowClear}
                placeholder={placeholder}
                filterOption={filterOption}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                onPopupScroll={this.handlePopupScroll}
                onBlur={this.handleBlur}
                loading={fetching}
            >
                {options}
            </Select>
        )
    }
}
