import React from 'react';
import BaseDataSelect from './BaseDataSelect';
import { fetchDemoDataList } from '@/services/basic';

export class DemoSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'code'} {...this.props} action={fetchDemoDataList}/>;
    }
}
