'use strict';
import React from 'react';
import AssociativeSearch from '../AssociativeSearch';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { removeEmptyProperty } from '@/utils';
import diff from 'deep-diff'

function createPage() {
    return {page_num:1,page_size:20,total:Infinity,data:[]}
}
export default class extends React.Component{
    state={
        error:null,
        filter:undefined,
        pagination:{page_num:1,page_size:20,total:Infinity,data:[]}
    };
    static propTypes = {
        action: PropTypes.func.isRequired
    };
    componentWillReceiveProps(nextProps){
        if(diff(this.props.params,nextProps.params)){
            setTimeout(()=>{
                this.handleFetch(this.state.filter,createPage())
            })
        }
    }
    hasFoundItems=false;
    lastData=[];
    handleFetch=(filter,pagination)=>{
        const {action,labelKey,searchKey=labelKey,params,showAll} = this.props;
        if(filter!==this.state.filter){
            pagination = createPage();
        }
        const hasPage = !!pagination;
        if(!hasPage)pagination = this.state.pagination;
        if(showAll)pagination.page_size = 999;
        this.setState({error:null});
        return action(removeEmptyProperty({
            page_num:pagination.page_num,
            page_size:pagination.page_size,
            ...params,
            [searchKey]:filter,
        })).then(res=>{
            pagination.total = res.total;
            pagination.data = hasPage?pagination.data.concat(res.data):res.data;
            this.lastData = this.state.pagination;
            this.hasFoundItems = pagination.data.length>0;
            this.setState({pagination,filter});
            return pagination.data;
        },err=>{
            this.setState({error:err.message})
        })
    };
    handleScrollBottom=()=>{
        const {pagination} = this.state;
        const hasNext = pagination.total/pagination.page_size > pagination.page_num;
        if(!hasNext)return null;
        pagination.page_num++;
        return this.handleFetch(this.state.filter,pagination);
    };
    // handleBlur=(evt)=>{
    //     if(!this.hasFoundItems)this.setState({pagination:this.lastData});
    //     if(this.props.onBlur)this.props.onBlur(evt);
    // };
    render(){
        if(this.state.error)return <Alert type={'error'} showIcon message={this.state.error}/>;
        const {fetchOnSearch=true,fetchOnMount=true,...restProps} = this.props;
        return <AssociativeSearch {...restProps}
                                  fetchOnMount={fetchOnMount}
                                  fetchOnSearch={fetchOnSearch}
                                  onFetch={this.handleFetch}
                                  data={this.state.pagination.data}
                                  // onBlur={this.handleBlur}
                                  onScrollBottom={this.handleScrollBottom}/>
    }
}
