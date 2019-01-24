import {connect} from "dva";
import React from 'react';

export default function (option) {
    return function (Component) {
        return createWrapperComponent(option,Component);
    }
}

function createWrapperComponent(option,Component) {
    @connect(({easyTableProvider})=>({
        easyTableProvider
    }))
    class WrapperComponent extends React.PureComponent {
        render() {
            return React.createElement(Component,{
                ...this.props,
                ...extendProvider(this.props,option)
            })
        }
    }
    return WrapperComponent;
}

function extendProvider(props,option) {
    if(!option)return;
    const args = {
        easyTableProvider:props.easyTableProvider
    };
    Object.keys(props.easyTableProvider.page).map(name=>{
        args[name] = {
            page:props.easyTableProvider.page[name],
            loading:props.easyTableProvider.loading[name],
            params:props.easyTableProvider.params[name],
            fetch(params,pagination){
                props.dispatch({
                    type: 'easyTableProvider/fetch',
                    payload: {
                        name,
                        params,
                        pagination
                    }
                })
            },
            search(params){
                props.dispatch({
                    type: 'easyTableProvider/search',
                    payload: {
                        name,
                        params,
                    }
                })
            },
            paging(pagination){
                props.dispatch({
                    type: 'easyTableProvider/paging',
                    payload: {
                        name,
                        pagination,
                    }
                })
            },
            refresh(pagination){
                props.dispatch({
                    type: 'easyTableProvider/refresh',
                    payload: {
                        name,
                        pagination
                    }
                })
            },
            clean(){
                props.dispatch({
                    type:'easyTableProvider/clean',
                    payload:{
                        name
                    }
                })
            }
        }
    });
    return option(args);
}