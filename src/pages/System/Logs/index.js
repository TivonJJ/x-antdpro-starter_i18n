import React from 'react';
import FilterForm from './filter'
import DataTable from './table'

export default class extends React.Component{
    render(){
        return <React.Fragment>
            <FilterForm/>
            <DataTable/>
        </React.Fragment>
    }
}
