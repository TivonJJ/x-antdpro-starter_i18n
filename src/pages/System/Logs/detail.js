import React, { Fragment } from 'react';
import {Modal} from 'antd'
import DescriptionList from '@/components/DescriptionList';
import JSONView from 'react-json-view'
import {FormattedMessage,formatMessage} from 'umi/locale'
import { ServicePlatform } from '@/constants/logs';

const {Description} = DescriptionList;

export default class Component extends React.Component {
    state={
        visible:false,
        data:null
    };

    close=()=>{
        this.setState({data:null,visible:false});
    };

    show=(data)=>{
        this.setState({data,visible:true});
    };

    getLogData=(packet)=>{
        try {
            packet = packet ? JSON.parse(packet):{};
            return packet
        }catch (e) {
            return {}
        }
    };

    render(){
        const {visible,data} = this.state;
        return (
            <Modal title={formatMessage({id:'Common.status.detail'})} width={800} footer={null} onCancel={this.close} visible={visible}>
                {data && <Fragment>
                    <DescriptionList col={2}>
                        <Description term={formatMessage({id:'Page.system.logs.label.operationTime'})}>{data.create_time}</Description>
                        <Description term={formatMessage({id:'Page.system.logs.label.platform'})}>
                            <FormattedMessage id={ServicePlatform[data.platform]} />
                        </Description>
                        <Description term={formatMessage({id:'Page.system.logs.label.operationType'})}>{data.operation}</Description>
                        <Description term={formatMessage({id:'Page.system.logs.label.operator'})}>{data.operator_name}</Description>
                        <Description term={formatMessage({id:'Page.system.logs.label.logNote'})}>{data.description}</Description>
                    </DescriptionList>
                    <div style={{margin:'15px 0 10px'}}>
                        <FormattedMessage id={'Page.system.logs.label.packet'} />：
                    </div>
                    <JSONView theme={"ocean"} src={this.getLogData(data.data_pack)} />
                         </Fragment>}
            </Modal>
        );
    }
}
