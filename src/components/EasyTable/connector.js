import {connect} from "dva";
import React from 'react';

export default function (getProps,options={}) {
    return function (Component) {
        return createWrapperComponent(getProps,options,Component);
    }
}

function createWrapperComponent(getProps,options,Component) {
    @connect(({easyTableProvider})=>({
        easyTableProvider
    }))
    class WrapperComponent extends React.PureComponent {
        render() {
            const extProps = extendProvider(this.props, getProps);
            if(options.ensureProvider && Object.keys(extProps).some(key=>!extProps[key]))return null;
            return React.createElement(Component, {
                ...this.props,
                ...extProps
            })
        }
    }
    return WrapperComponent;
}

function extendProvider(props,getProps) {
    const args = {
        easyTableProvider:props.easyTableProvider
    };
    if(!getProps)return args;
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
            update(callback){
                props.dispatch({
                    type:'easyTableProvider/update',
                    payload:{
                        name,
                        data:callback(props.easyTableProvider.page[name].data)
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
    return getProps(args);
}
