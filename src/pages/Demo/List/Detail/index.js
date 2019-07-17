import React, { Component } from 'react';
import { Alert, Button, Card, Spin,Modal,message } from 'antd';
import { connect } from 'dva';
import {formatMessage} from 'umi/locale';
import { Status } from '@/constants/demo';
import EasyTable from '@/components/EasyTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

const {Description} = DescriptionList;

@EasyTable.connect(({demoTable})=>({
    demoTable
}))
@connect(({demoDetail,loading})=>({
    demoDetail,
    fetching:loading.effects['demoDetail/getDetail']
}))
class Detail extends Component {
    state={
        error:null
    };

    componentWillMount() {
        this.fetchDetail();
    }

    fetchDetail=()=>{
        const {id} = this.props.match.params;
        this.props.dispatch({
            type:'demoDetail/getDetail',
            payload:id
        }).catch(e=>{
            this.setState({error:e.message})
        })
    };

    refreshParent=()=>{
        this.props.demoTable.refresh();// 刷新父页面列表数据
    };

    close=()=>{
        const {match:{params},dispatch} = this.props;
        Modal.confirm({
            title:formatMessage({id:'Common.message.sure'}),
            content:formatMessage({id:'Page.demo.detail.closeTip'}),
            onOk:()=>{
                const {id} = params;
                dispatch({
                    type:'demoDetail/close',
                    payload:id
                }).then(()=>{
                    message.success(formatMessage({id:'Common.message.operationSuccess'}));
                    this.fetchDetail();
                    this.refreshParent();
                },e=>{
                    this.setState({error:e.message})
                })
            }
        })
    };

    render() {
        const {fetching=false,demoDetail:{detail}} = this.props;
        const {error} = this.state;
        if(fetching)return <Spin />;
        if(error)return <Alert type={'error'} message={error} />;
        if(!detail)return null;
        return (
            <PageHeaderWrapper
                title={formatMessage({ id: 'Page.demo.detail.title' })}
                content={
                    <DescriptionList>
                        <Description term={formatMessage({ id: 'Model.demo.no' })}>{detail.no}</Description>
                        <Description term={formatMessage({ id: 'Model.demo.status.name' })}>
                            {formatMessage({ id: Status[detail.status] })}
                        </Description>
                    </DescriptionList>
                }
                action={
                    detail.status == 1 &&
                    <Button type={'danger'} onClick={this.close}>
                        {formatMessage({ id: 'Common.message.close' })}
                    </Button>
                }
            >
                <Card title={formatMessage({ id: 'Page.demo.detail.basic' })}>
                    <DescriptionList>
                        <Description term={formatMessage({ id: 'Model.demo.no' })}>{detail.no}</Description>
                        <Description term={formatMessage({ id: 'Model.demo.name' })}>{detail.name}</Description>
                    </DescriptionList>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Detail;
