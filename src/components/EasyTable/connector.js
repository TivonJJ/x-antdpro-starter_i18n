import {connect} from "dva";
import React from 'react';

function mapProviderProps(props,getProps) {
    const args = {
        easyTableProvider:props.easyTableProvider
    };
    if(!getProps)return args;
    Object.keys(props.easyTableProvider.page).forEach(name=>{
        args[name] = {
            page:props.easyTableProvider.page[name],
            loading:props.easyTableProvider.loading[name],
            params:props.easyTableProvider.params[name],
            fixedParams:props.easyTableProvider.fixedParams[name],
            errors:props.easyTableProvider.errors[name],
            pageProps:props.easyTableProvider.errors[name],
            dataProp:props.easyTableProvider.errors[name],
            fetch(params,pagination){
                return props.dispatch({
                    type: 'easyTableProvider/fetch',
                    payload: {
                        name,
                        params,
                        pagination
                    }
                })
            },
            search(params){
                return props.dispatch({
                    type: 'easyTableProvider/search',
                    payload: {
                        name,
                        params,
                    }
                })
            },
            paging(pagination){
                return props.dispatch({
                    type: 'easyTableProvider/paging',
                    payload: {
                        name,
                        pagination,
                    }
                })
            },
            refresh(pagination){
                return props.dispatch({
                    type: 'easyTableProvider/refresh',
                    payload: {
                        name,
                        pagination
                    }
                })
            },
            update(callback){
                return props.dispatch({
                    type:'easyTableProvider/update',
                    payload:{
                        name,
                        data:callback(props.easyTableProvider.page[name].data)
                    }
                })
            },
            clean(){
                return props.dispatch({
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

function createWrapperComponent(getProps,options,Component) {
    @connect(({easyTableProvider})=>({
        easyTableProvider
    }))
    class WrapperComponent extends React.PureComponent {
        render() {
            const extProps = mapProviderProps(this.props, getProps);
            if(options.ensureProvider && Object.keys(extProps).some(key=>!extProps[key]))return null;
            return React.createElement(Component, {
                ...this.props,
                ...extProps
            })
        }
    }
    return WrapperComponent;
}

export default function (getProps,options={}) {
    return function decorate(Component) {
        return createWrapperComponent(getProps,options,Component);
    }
}
