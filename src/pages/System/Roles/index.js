'use strict';
import React from 'react';
import Page from './Page';
import {formatMessage} from 'umi/locale';
import { Card } from 'antd';
import { connect } from 'dva';

@connect(({role,loading}) => ({
    role,
    loading
}))
export default class extends React.Component{
    componentWillUnmount() {
        this.props.dispatch({
            type: 'role/reset'
        })
    }
    render(){
        const getLoadingStatus = (effects)=>{
            for(let i=0;i<effects.length;i++){
                if(this.props.loading.effects['role/' + effects[i]]){
                    return true;
                }
            }
            return false;
        };

        const {role} = this.props;
        const fetchEffects = ['fetch','fetchPermissions'],
            updateEffects=['updateRole','addRole','setStatus','deleteRole'];
        let fetching = getLoadingStatus(fetchEffects);
        const updating = getLoadingStatus(updateEffects);
        return <Card bordered={false}>
            <Page role={role}
                  fetching={fetching}
                  updating={updating}
                  dispatch={this.props.dispatch}/>
        </Card>
    }
}
