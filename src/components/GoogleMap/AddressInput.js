'use strict';
import React, { Fragment } from 'react';
import { Button, Input, message } from 'antd';
import controllable from '@/components/react-controllables';
import GoogleMap from './index';
import styles from './styles.less';
import { FormattedMessage } from 'umi/locale';
import AddressPicker from './AddressPicker';
import _ from 'lodash';

@controllable(['value'])
class AddressInput extends React.Component{
    state={
        busy:false
    };
    static defaultProps={
        center: { lat: 43.6017247, lng: -79.6409004 },
        marker: { lat: 43.6017247, lng: -79.6409004 }
    };
    handlePickAddress=(point,closeMap)=>{
        if(!point){
            closeMap();
            this.change(undefined);
            return;
        }
        this.setState({busy:true});
        GoogleMap.geocodeLatLng(point).then(res=>{
            const addressMap = {};
            console.log(res);
            res.address_components.map(item=>{
                addressMap[item.types[0]] = item.long_name;
            });
            this.props.onChange({
                country: addressMap.country,
                postalCode: addressMap.postal_code,
                province: addressMap.administrative_area_level_1,
                city: addressMap.locality,
                street: [addressMap.street_number,addressMap.route].join(' ').trim(),
                formatted_address: res.formatted_address,
                latLng:point
            });
            closeMap();
        },err=>{
            message.error(err.message);
        }).finally(()=>{
            this.setState({busy:false});
        });
    };
    handleFieldChange=(evt,type)=>{
        const value = {...this.props.value};
        value[type] = evt.target.value;
        value['formatted_address'] = getFormatAddress(value);
        this.props.onChange(value);

        function getFormatAddress(addr) {
            return [addr.street,addr.city,addr.province,addr.country,addr.postalCode].join(',');
        }
    };
    render(){
        const {value={},...restProps} = this.props;
        return <div className={styles.inputGroup}>
            <AddressPicker {...restProps} confirmLoading={this.state.busy} value={restProps.marker} onChange={this.handlePickAddress}>
                <Button icon={'environment-o'} className={styles.picker}>
                    <FormattedMessage id={'Component.googleMap.pickerButton'}/>
                </Button>
            </AddressPicker>
            {!_.isEmpty(value) && <Fragment>
                <div>
                    <Input
                        addonBefore={<FormattedMessage id={'Component.googleMap.label.street'}/>}
                        value={value.street}
                        onChange={(e)=>this.handleFieldChange(e,'street')}
                    />
                </div>
                <div>
                    <Input value={value.city}
                           disabled
                           onChange={(e)=>this.handleFieldChange(e,'city')}
                           addonBefore={<FormattedMessage id={'Component.googleMap.label.city'}/>}/>
                </div>
                <div>
                    <Input value={value.province}
                           disabled
                           onChange={(e)=>this.handleFieldChange(e,'province')}
                           addonBefore={<FormattedMessage id={'Component.googleMap.label.province'}/>}/>
                </div>
                <div>
                    <Input value={value.postalCode}
                           onChange={(e)=>this.handleFieldChange(e,'postalCode')}
                           addonBefore={<FormattedMessage id={'Component.googleMap.label.postalCode'}/>}/>
                </div>
                <div>
                    <Input value={value.country}
                           onChange={(e)=>this.handleFieldChange(e,'country')}
                           addonBefore={<FormattedMessage id={'Component.googleMap.label.country'}/>}/>
                </div>
            </Fragment>}
        </div>
    }
}

AddressInput.requiredValidator = function(rule, value, callback){
    const errors = [];
    if(!value)return callback(errors);
    if(
        !value.street || !value.city || !value.province || !value.postalCode || !value.country){
        errors.push(new Error('Incomplete address'))
    }
    callback(errors);
};

export default AddressInput;
