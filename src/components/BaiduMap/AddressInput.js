'use strict';
import React, { Fragment } from 'react';
import { Button, Input } from 'antd';
import controllable from '@/components/react-controllables';
import { FormattedMessage } from 'umi/locale';
import AddressPicker from './AddressPicker';
import './AddressInput.less';

@controllable(['value'])
class AddressInput extends React.Component{
    handleFieldChange=(evt,type)=>{
        const value = {...this.props.value};
        value[type] = evt.target.value;
        this.props.onChange(value);
    };
    handlePickAddress=(location)=>{
        this.props.onChange(location);
    };
    render(){
        const {value={},...restProps} = this.props;
        return <div className={'comp-bmap_input'}>
            <AddressPicker {...restProps}
                           initialCenter={value.point}
                           initialMarker={value.point}
                           onOk={this.handlePickAddress}>
                <Button icon={'environment-o'} className={'comp-bmap_input__picker'}>
                    百度地图定位
                </Button>
            </AddressPicker>
            {!isEmpty(value) && <Fragment>
                <div>
                    <Input value={value.province}
                           disabled
                           onChange={(e)=>this.handleFieldChange(e,'province')}
                           addonBefore={'省'}/>
                </div>
                <div>
                    <Input value={value.city}
                           disabled
                           onChange={(e)=>this.handleFieldChange(e,'city')}
                           addonBefore={'城市'}/>
                </div>
                <div>
                    <Input value={value.district}
                           disabled
                           onChange={(e)=>this.handleFieldChange(e,'city')}
                           addonBefore={'区'}/>
                </div>
                <div>
                    <Input
                        value={value.street}
                        onChange={(e)=>this.handleFieldChange(e,'street')}
                        addonBefore={'街道'}
                    />
                </div>
                <div>
                    <Input value={value.postalCode}
                           onChange={(e)=>this.handleFieldChange(e,'postalCode')}
                           addonBefore={'邮编'}/>
                </div>
            </Fragment>}
        </div>
    }
}

AddressInput.requiredValidator = function(rule, value, callback){
    const errors = [];
    if(!value)return callback(errors);
    if(
        !value.province || !value.city || !value.district || !value.street /*|| !value.postalCode*/){
        errors.push(new Error('地址不完整'))
    }
    callback(errors);
};

function isEmpty(obj) {
    return !obj || Object.keys(obj).length<=0;
}

export default AddressInput;
