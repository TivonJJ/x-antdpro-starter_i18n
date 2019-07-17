import React from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import Page from './Page';

export default
@connect(({role,loading}) => ({
    role,
    loading
}))class extends React.Component{
    componentWillUnmount() {
        this.props.dispatch({
            type: 'role/reset'
        })
    }

    render(){
        const getLoadingStatus = (effects)=>{
            for(let i=0;i<effects.length;i++){
                if(this.props.loading.effects[`role/${  effects[i]}`]){
                    return true;
                }
            }
            return false;
        };

        const {role} = this.props;
        const fetchEffects = ['fetch','fetchPermissions'];
            const updateEffects=['updateRole','addRole','setStatus','deleteRole'];
        const fetching = getLoadingStatus(fetchEffects);
        const updating = getLoadingStatus(updateEffects);
        return (
            <Card bordered={false}>
                <Page
                    role={role}
                    fetching={fetching}
                    updating={updating}
                    dispatch={this.props.dispatch}
                />
            </Card>
        )
    }
}
