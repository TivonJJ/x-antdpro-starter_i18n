import React, { Fragment } from 'react';
import { Icon, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import AddressPreview from './AddressPreview';

export default class AddressPreviewButton extends React.Component{
    state={
        visible:false
    };

    showModal=()=>{
        this.setState({visible:true})
    };

    hideModal=()=>{
        this.setState({visible:false})
    };

    render(){
        return (
            <Fragment>
            <span role={'button'} onClick={this.showModal}>
                <Icon type={"environment"} theme={"twoTone"} style={{fontSize:20}}/>
            </span>
                <Modal
                    destroyOnClose
                    title={formatMessage({id:'Component.googleMap.addressPreviewTitle'})}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.hideModal}
                    width={800}
                >
                    <AddressPreview address={this.props.address}/>
                </Modal>
            </Fragment>
        )
    }
}
