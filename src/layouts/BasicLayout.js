import React from 'react';
import PropTypes from 'prop-types';
import {Layout} from 'antd';
import router from 'umi/router';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import {enquireScreen} from 'enquire-js';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import { urlToList } from '../utils';
import BaseLayout from './BaseLayout';
import Header from './Header';

const {Content, Footer} = Layout;
const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
    },
};

let guessIsMobile;
enquireScreen(b => {
    guessIsMobile = b;
});

@connect(({user, global,setting}) => ({
    currentUser: user.currentUser || {},
    collapsed: global.collapsed,
    ...setting
}))
class BasicLayout extends BaseLayout {
    static childContextTypes = {
        location: PropTypes.object,
        breadcrumbNameMap: PropTypes.object,
    };

    state = {
        isMobile:guessIsMobile,
        currentSys:'',
        redirectData:[]
    };

    getChildContext() {
        const {location,currentUser} = this.props;
        return {
            location,
            breadcrumbNameMap: currentUser.routeMap,
        };
    }

    componentWillMount(){
        this.updateCurrentSys();
    }

    componentDidMount() {
        enquireScreen(mobile => {
            this.setState({
                isMobile: mobile,
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.updateCurrentSys(nextProps);
        }
    }

    /**
     * 根据菜单取配置获得第一个有效的路由配置并进入.
     */
    autoRedirectToFirstRoute(){
        if(!this.props.currentUser)return;
        const {menus,routeMap} = this.props.currentUser;
        if(!menus)return;
        const {location: {pathname}} = this.props;
        const paths = pathname.split('/').filter(item=>!!item);

        function findFirstChild(list) {
            if(!list)return null;
            for(let i=0;i<list.length;i++){
                const menu = list[i];
                if(menu.status != 2){
                    if(menu.isMenu)return menu;
                    if(menu.children && menu.children.length>0)return findFirstChild(menu.children);
                }
            }
            return null;
        }

        if(menus.length>0){
            if(paths.length===0){
                const firstSys = menus.find(({status})=>status==1);
                if(firstSys){
                    router.replace(firstSys.route);
                }
            }else if(paths.length===1){
                const routeMenus = routeMap[this.state.currentSys];
                const firstRoute = findFirstChild(routeMenus.children);
                if(firstRoute)router.replace(firstRoute.route);
            }
        }
    };

    updateCurrentSys(props){
        const {location: {pathname}} = props || this.props;
        const sysPath = urlToList(pathname)[0];
        if(this.state.currentSys !== sysPath)this.setState({
            currentSys: sysPath,
        },()=>{
            this.autoRedirectToFirstRoute()
        });
    }

    getSiderMenu(){
        const {currentSys} = this.state;
        const {currentUser} = this.props;
        if(!currentSys || !currentUser || !currentUser.routeMap || !currentUser.routeMap[currentSys])return null;
        return currentUser.routeMap[currentSys].children;
    };

    handleMenuCollapse = collapsed => {
        this.props.dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    getLayoutStyle = () => {
        // eslint-disable-next-line react/no-this-in-sfc
        const { isMobile } = this.state;
        // eslint-disable-next-line react/no-this-in-sfc
        const { fixSiderbar, collapsed, layout } = this.props;
        if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
            return {
                paddingLeft: collapsed ? '80px' : '256px',
            };
        }
        return null;
    };

    getContentStyle = () => {
        const { fixedHeader } = this.props;
        return {
            margin: '24px 24px 0',
            paddingTop: fixedHeader ? 64 : 0,
        };
    };

    render() {
        const {
            collapsed,
            location,
            children,
            navTheme,
            headerTheme
        } = this.props;
        const {isMobile} = this.state;
        const layout = (
            <Layout>
                <SiderMenu
                    menuData={this.getSiderMenu()}
                    collapsed={collapsed}
                    location={location}
                    isMobile={this.state.isMobile}
                    onCollapse={this.handleMenuCollapse}
                    theme={navTheme}
                    {...this.props}
                />
                <Layout
                    className={"layout-body"}
                    style={{
                        ...this.getLayoutStyle(),
                        minHeight: '100vh',
                    }}
                >
                    <Header
                        handleMenuCollapse={this.handleMenuCollapse}
                        isMobile={isMobile}
                        theme={headerTheme}
                        {...this.props}
                    />
                    <Content style={this.getContentStyle()}>
                        {children}
                    </Content>
                    <Footer style={{ padding: 0 }}>
                        <GlobalFooter />
                    </Footer>
                </Layout>
            </Layout>
        );

        return (
            <DocumentTitle title={this.getPageTitle()}>
                <ContainerQuery query={query}>
                    {params => <div className={classNames(params)}>{layout}</div>}
                </ContainerQuery>
            </DocumentTitle>
        );
    }
}

export default BasicLayout;
