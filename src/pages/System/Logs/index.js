import React from 'react';
import FilterForm from './filter'
import FilterTable from './table'
import DetailModal from './detail'
import { connect } from 'dva/index';

@connect(({logs}) => {
    logs
})
export default class extends React.Component{
    componentWillUnmount(){
        this.props.dispatch({
            type:'logs/$RESET'
        })
    }
    render(){
        return <React.Fragment>
            <FilterForm/>
            <FilterTable/>
            <DetailModal/>
        </React.Fragment>
    }
}
