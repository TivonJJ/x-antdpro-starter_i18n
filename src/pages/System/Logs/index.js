import React from 'react';
import FilterForm from './filter'
import DataTable from './table'

export default function() {
    return (
        <React.Fragment>
            <FilterForm/>
            <DataTable/>
        </React.Fragment>
    )
}
