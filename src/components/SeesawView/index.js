import React, { Fragment } from 'react';
import PropsTypes from 'prop-types';
import withRouter from 'umi/withRouter';

/**
 * 使用子路由方式实现保存父页面状态
 * 由于标准父子路由会同时显示，这里判断路由来控制父/子界面的显示和隐藏，仅使用display属性来控制，所以会一直存在内存中，状态不会消失。
 * 此方式主要用在回退上一界面需保存上一界面的状态的情况，如详情页回退列表页，可以减少使用store来存储所有状态的逻辑
 */
class SeesawRoute extends React.PureComponent {
    static propTypes={
        child: PropsTypes.element.isRequired,
        childProps: PropsTypes.object,
        onResume: PropsTypes.func
    };
    componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.match.isExact !== nextProps.match.isExact){
            if(nextProps.match.isExact && this.props.onResume){
                this.props.onResume(nextProps.match);
            }
        }
    }
    render() {
        const isRoot = this.props.match.isExact;
        let {child:children,children:root,childProps} = this.props;
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
            <div style={{display:isRoot?'':'none'}} className={'seesaw-route'}>{root}</div>
            {!isRoot&&<div className={'seesaw-route'}>{children}</div>}
        </Fragment>
    }
}

export default withRouter(SeesawRoute);
