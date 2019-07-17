import React, { Fragment } from 'react';
import { Icon, Modal } from 'antd';
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
                    title={'地址预览'}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.hideModal}
                    width={800}
                    centered
                >
                    <div style={{height:300}}>
                        <AddressPreview address={this.props.address}/>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}
