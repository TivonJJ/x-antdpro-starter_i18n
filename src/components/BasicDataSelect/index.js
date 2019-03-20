'use strict';
import React, {PureComponent} from 'react';
import BaseDataSelect from './BaseDataSelect';
import {getDictionary, getIndustry, getWoRoles} from '@/services/basic';
import { getPayChannelList, getPayModeList, getProductList} from '@/services/payment';
import { getPartnerList, getPartnerTags } from '@/services/partner';
import { getAppList } from '@/services/application';
import { getMerchants, getStoreList } from '@/services/merchant';

// 行业类目选择
export class IndustrySelect extends PureComponent{
    render() {
        return <BaseDataSelect showAll labelKey={'industry_name'} searchKey={'industry_name'} valueKey={'industry_code'} {...this.props} action={getIndustry}/>
    }
}

// 工单角色选择列表
export class WoRolesSelect extends PureComponent{
    render() {
        return <BaseDataSelect labelKey={'name'} searchKey={'name'} valueKey={'role_id'} {...this.props} action={getWoRoles}/>
    }
}

/*
* 支付类
* ============================================
*/
//支付方式选择列表
export class PayModeSelect extends PureComponent{
    render() {
        return <BaseDataSelect labelKey={'pay_mode_name'} searchKey={'pay_mode_name'} valueKey={'pay_mode_id'} {...this.props} action={getPayModeList}/>
    }
}

//支付通道选择列表
export class PayChannelSelect extends PureComponent{
    render() {
        return <BaseDataSelect labelKey={'pay_channel_name'} searchKey={'pay_channel_name'} valueKey={'pay_channel_id'} {...this.props} action={getPayChannelList}/>
    }
}

//支付产品选择列表
export class ProductSelect extends PureComponent{
    render(){
        return <BaseDataSelect labelKey={'product_name'} searchKey={'product_name_like'} valueKey={'product_no'} {...this.props} action={getProductList}/>
    }
}

//支付场景选择列表
export class PaySceneSelect extends PureComponent{
    render(){
        return <BaseDataSelect labelKey={'attr_value'} valueKey={'attr_key'} showSearch={false} {...this.props} action={(params)=>(
            getDictionary({...params,param_type:'PAY_SCENE'})
        )}/>
    }
}
//支付能力选择列表
export class PayAbilitySelect extends PureComponent{
    render(){
        return <BaseDataSelect labelKey={'attr_value'} valueKey={'attr_key'} showSearch={false} {...this.props} action={(params)=>(
            getDictionary({...params,param_type:'TRANS_TYPE'})
        )}/>
    }
}

//合作伙伴标签选择列表
export class PartnerTagSelect extends PureComponent{
    render() {
        return <BaseDataSelect labelKey={'name'} searchKey={'name'} valueKey={'tag_id'} {...this.props} action={getPartnerTags}/>
    }
}

//应用选择列表
export class APPSelect extends PureComponent{
    render() {
        return <BaseDataSelect labelKey={'app_name'} searchKey={'app_name'} valueKey={'app_id'} {...this.props} action={getAppList}/>
    }
}

//商户选择列表
export class MerchantSelect extends PureComponent{
    render() {
        return <BaseDataSelect labelKey={'merchant_name'} searchKey={'keywords'} valueKey={'merchant_no'} {...this.props} action={getMerchants}/>
    }
}

//商户门店列表
export class MerchantStoreSelect extends PureComponent{
    render() {
        return <BaseDataSelect labelKey={'store_name'} valueKey={'store_no'} showSearch={false} {...this.props} action={getStoreList}/>
    }
}

//获取伙伴列表
export class PartnerList extends PureComponent{
    render() {
        return <BaseDataSelect labelKey={'partner_name'} searchKey={'partner_key'} valueKey={'partner_no'} {...this.props} action={getPartnerList}/>
    }
}
