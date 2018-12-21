'use strict';
import React from 'react';
import AssociativeSearch from '../AssociativeSearch';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { removeEmptyProperty } from '@/utils';

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
        if(this.props.params !== nextProps.params){
            setTimeout(()=>{
                this.handleFetch(this.state.filter,createPage())
            })
        }
    }
    handleFetch=(filter,pagination)=>{
        const {action,labelKey,searchKey=labelKey,params} = this.props;
        if(filter!==this.state.filter){
            pagination = createPage();
        }
        const hasPage = !!pagination;
        if(!hasPage)pagination = this.state.pagination;
        return action(removeEmptyProperty({
            page_num:pagination.page_num,
            page_size:pagination.page_size,
            ...params,
            [searchKey]:filter,
        })).then(res=>{
            pagination.total = res.total;
            pagination.data = hasPage?pagination.data.concat(res.data):res.data;
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
    render(){
        if(this.state.error)return <Alert type={'error'} showIcon message={this.state.error}/>;
        const {fetchOnSearch=true,fetchOnMount=true,...restProps} = this.props;
        return <AssociativeSearch {...restProps}
                                  fetchOnMount={fetchOnMount}
                                  fetchOnSearch={fetchOnSearch}
                                  onFetch={this.handleFetch}
                                  data={this.state.pagination.data}
                                  onScrollBottom={this.handleScrollBottom}/>
    }
}
