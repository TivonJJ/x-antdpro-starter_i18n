import React, { Fragment } from 'react';
import PropsTypes from 'prop-types';
import withRouter from 'umi/withRouter';

/**
 * 使用子路由方式实现保存父页面状态
 * 由于标准父子路由会同时显示，这里判断路由来控制父/子界面的显示和隐藏，仅使用display属性来控制，所以会一直存在内存中，状态不会消失。
 * 此方式主要用在回退上一界面需保存上一界面的状态的情况，如详情页回退列表页，可以减少使用store来存储所有状态的逻辑
 */
const SeesawViewRouter = withRouter(class extends React.PureComponent {
    static propTypes={
        child: PropsTypes.any.isRequired,
        childProps: PropsTypes.object,
        onResume: PropsTypes.func,
        forceRender: PropsTypes.bool, // 是否强制渲染路由，如果打开的子页面，父页面也会被隐藏渲染
    };
    static defaultProps={
        forceRender:false
    };
    shouldRenderRoot = this.props.match.isExact; // 判断是否渲染父级，避免直接进入子路由父级也会被渲染出来
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.isExact)this.shouldRenderRoot = true;
        if(this.props.match.isExact !== nextProps.match.isExact){
            if(nextProps.match.isExact && this.props.onResume){
                this.props.onResume(nextProps.match);
            }
        }
    }
    render() {
        const isRoot = this.props.match.isExact;
        let {child:children,children:root,childProps,forceRender} = this.props;
        if(childProps && children.props.children){
            const childrenWithProps = React.Children.map(children.props.children,(item=>{
                const _render = item.props.render;
                return React.cloneElement(item,{render:props=>{
                        return _render({...props,...childProps});
                    }})
            }));
            children = React.cloneElement(children,{children:childrenWithProps})
        }
        return <Fragment>
            {(this.shouldRenderRoot || forceRender) &&
            <div style={{ display: isRoot ? '' : 'none' }} className={'seesaw-route'}>{root}</div>
            }
            {!isRoot&&<div className={'seesaw-route'}>{children}</div>}
        </Fragment>
    }
});

function createSeesawView(options={},RootComponent) {
    class SeesawViewWrapper extends React.Component{
        onResume=(match)=>{
            if(options.onResume){
                options.onResume.call(this.seesawViewRootRef,match);
            }
        };
        render() {
            let childProps = options.childProps;
            if(typeof childProps === 'function'){
                childProps = childProps(this.props);
            }
            return (
                <SeesawViewRouter child={this.props.children}
                                  childProps={childProps}
                                  forceRender={options.forceRender}
                                  onResume={this.onResume}>
                    <RootComponent {...this.props} ref={ref=>this.seesawViewRootRef=ref}/>
                </SeesawViewRouter>
            )
        }
    }
    return withRouter(SeesawViewWrapper);
}

export default function SeesawView(options) {
    return function (RootComponent){
        return createSeesawView(options,RootComponent)
    };
};
