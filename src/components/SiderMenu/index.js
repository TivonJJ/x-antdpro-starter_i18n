import React from 'react';
import { Drawer } from 'antd';
import SiderMenu from './SliderMenu';
import {getFlatMenuKeys} from './BaseMenu';

const SiderMenuWrapper = props => {
  const { isMobile, menuData, collapsed } = props;
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement={"left"}
      onClose={() => {
        props.onCollapse(true);
      }}
      style={{
        padding: 0,
        height: '100vh',
      }}
    >
      <SiderMenu
        {...props}
        flatMenuKeys={getFlatMenuKeys(menuData)}
        collapsed={isMobile ? false : collapsed}
      />
    </Drawer>
  ) : (
    <SiderMenu {...props} flatMenuKeys={getFlatMenuKeys(menuData)} />
  );
};

export default SiderMenuWrapper;
