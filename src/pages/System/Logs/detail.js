import React from 'react';
import {Modal} from 'antd'
import DescriptionList from '@/components/DescriptionList';
import JSONView from 'react-json-view'
import {connect} from 'dva'
import {FormattedMessage,formatMessage} from 'umi/locale'
import { ServicePlatform } from '@/constants/logs';
const {Description} = DescriptionList

@connect(({logs})=>{
    return {
        viewItem:logs.viewItem,
        modalVisible:logs.modalVisible
    }
})
export default class Component extends React.Component {

    close=()=>{
        this.props.dispatch({
            type:'logs/closeModal'
        })
    }
    getLogData=(packet)=>{
        try {
            packet = packet ? JSON.parse(packet):{}
            return packet
        }catch (e) {
            return {}
        }
    }
    render(){
        const {modalVisible,viewItem} = this.props
        return (
            <Modal title={formatMessage({id:'Common.status.detail'})} width={800} footer={null} onCancel={this.close} visible={modalVisible}>
                <DescriptionList col={2}>
                    <Description term={formatMessage({id:'Page.system.logs.label.operationTime'})}>{viewItem.create_time}</Description>
                    <Description term={formatMessage({id:'Page.system.logs.label.platform'})}>
                        <FormattedMessage id={ServicePlatform[viewItem.platform]}/>
                    </Description>
                    <Description term={formatMessage({id:'Page.system.logs.label.operationType'})}>{viewItem.operation}</Description>
                    <Description term={formatMessage({id:'Page.system.logs.label.operator'})}>{viewItem.operator_name}</Description>
                    <Description term={formatMessage({id:'Page.system.logs.label.logNote'})}>{viewItem.description}</Description>
                </DescriptionList>
                <div style={{margin:'15px 0 10px'}}>
                    <FormattedMessage id={'Page.system.logs.label.packet'}/>：
                </div>
                <JSONView theme={ "ocean" } src={this.getLogData(viewItem.data_pack)}/>
            </Modal>
        );
    }
}
