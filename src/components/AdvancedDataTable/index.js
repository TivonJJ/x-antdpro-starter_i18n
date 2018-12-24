'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Col, Row, Spin, Table } from 'antd';
import { createNormalPagination } from '@/utils';
import request from '@/utils/request';
import { FormattedMessage } from 'umi/locale';

export default class AdvancedDataTable extends React.Component{
    static propTypes={
        source:PropTypes.oneOfType([PropTypes.func,PropTypes.string]).isRequired,
        autoFetch:PropTypes.bool,
        params:PropTypes.object,
        resetPageOnParamsChange:PropTypes.bool,
        headerCol:PropTypes.array
    };
    static defaultProps={
        resetPageOnParamsChange:true,
        headerCol:[12,12]
    };
    state={
        error:null,
        busy:false,
        page:createNormalPagination()
    };
    componentDidMount(){
        const {autoFetch=true} = this.props;
        if(autoFetch){
            this.fetchData()
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.params !== nextProps.params){
            setTimeout(()=>{
                const {resetPageOnParamsChange} = this.props;
                if(resetPageOnParamsChange){
                    this.reload();
                }else{
                    this.refresh();
                }
            })
        }
    }
    fetchData=(pagination)=>{
        this.setState({error:null,busy:true});
        const page = {
            ...this.state.page,
            ...pagination
        };

        let fetch = this.props.source;
        if(typeof fetch === 'string'){
            fetch = ((params)=> {
                return request.post(this.props.source,params);
            });
        }
        fetch({
            page_num:page.current,
            page_size:page.pageSize,
            ...this.props.params
        }).then((result)=>{
            page.total = result.total;
            page.data = result.data;
            this.setState({page});
            this.props.onDataLoaded&&this.props.onDataLoaded(page);
        },err=>{
            this.setState({error:err.message});
            this.props.onError&&this.props.onError(err);
        }).finally(()=>{
            this.setState({busy:false});
        })
    };
    handleChange=(pagination)=>{
        this.fetchData(pagination);
        this.props.onChange&&this.props.onChange(pagination);
    };
    refresh=()=>{
        this.fetchData();
    };
    reload=()=>{
        this.fetchData(createNormalPagination());
    };
    render(){
        const {error,busy,page} = this.state;
        let {title=(page)=>(
            <FormattedMessage id={'Common.pagination.total'} values={{total:page.total}}/>
        ),extra,className,style,...restProps} = this.props;
        if(title===false)title = null;
        if(typeof title === 'function')title = title(page);
        const {headerCol} = this.props;
        return <div className={className} style={style}>
            <Spin spinning={busy}>
                <Row className={'gutter-bottom_lg'}>
                    <Col span={headerCol[0]}>{title}</Col>
                    <Col span={headerCol[1]} className={'text-right'}>{extra}</Col>
                </Row>
                {error?
                    <Alert
                        message={error}
                        type="error"
                        description={<div className={'text-center gutter-top'}>
                            <Button onClick={this.refresh}><FormattedMessage id={'Common.button.retry'}/></Button>
                        </div>}
                    />
                    :
                    <Table {...restProps} pagination={page} dataSource={page.data} onChange={this.handleChange}/>
                }
            </Spin>
        </div>
    }
}
