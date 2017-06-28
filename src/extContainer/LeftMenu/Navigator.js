import React from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import { Menu, Icon } from 'antd';


import { rootChildRoutes }  from '#/extRoutes';
import {BROADCAST_ROLE_HOST_STR, BROADCAST_ROLE_ASSIST_STR,} from '#/extConstants';


const Text = ({ icon, text }) => {
  return (
    <span>
      <Icon type={icon}/>
      <span className="nav-text">{text}</span>
    </span>
  );
}
const NavMenuItem = (menu) => {
  return (
    <Menu.SubMenu key={menu.path} title={<Text text={menu.name} icon={menu.icon}/>}>
      {
        menu.subRoutes.map(item => {
          return (
            <Menu.Item key={`/${menu.path}/${item.path}`}>
              {item.name}
            </Menu.Item>
          )
        })
      }
    </Menu.SubMenu>
  );
}


const Navigator = ({ user, collapse, routes, dispatch }) => {
  //console.debug(user.getRole());
  const roleFilterFn = roleFilterGen(user.getRole());
  //console.debug(rootChildRoutes.filter(showInNavFilterFn));
  const navRoutes = rootChildRoutes.filter(showInNavFilterFn);
  const availableNavs = navRoutes.filter(roleFilterFn).map(item => ({
    path: item.path,
    name: item.breadcrumbName,
    icon: item.icon,
    subRoutes: item.childRoutes.filter(showInNavFilterFn).filter(roleFilterFn).map(n => ({
      path:n.path,
      name:n.breadcrumbName,
    })),
  }));

  const defaultOpenKeys = [];
  //const defaultOpenKeys = collapse ? [] : navRoutes.map(item => item.path);
  //console.debug(defaultOpenKeys, 'defaultOpenKeys');
  const selectedKeys = getSelectedKeys(routes);
  const menuStyle = {flex: '1 1 auto', color: '#e3e3e3', overflowY: 'auto'};
  if (collapse) {
    delete menuStyle.overflowY;
  }

  const menuProps = {
    mode: collapse ? 'vertical' : 'inline',
    style: menuStyle,
    theme: 'dark',
    onClick: item => dispatch(push(item.key)),
    selectedKeys: selectedKeys,
    defaultOpenKeys: defaultOpenKeys,
  }

  return user.getRole() == BROADCAST_ROLE_HOST_STR || user.getRole() ==  BROADCAST_ROLE_ASSIST_STR ? (
    <Menu {...menuProps}>
      <LiveRoomMenu collapse={collapse} />
      {
        availableNavs.map((item, index) => NavMenuItem(item))
      }
    </Menu>
  ) :(
    <Menu {...menuProps}>
      {
        availableNavs.map((item, index) => NavMenuItem(item))
      }
    </Menu>
  );
}

function getSelectedKeys(routes) {
  // hack
  // get pathname to active side menu item
  // especially for route `/workshop/new`
  const currentSelectedKey = routes
    && routes[1]
    && routes[2]
    && `/${routes[1].path}/${routes[2].path}`;
  return [currentSelectedKey];
}

function roleFilterGen(role) {
  //return () => true;
  return item => ((item.roles && ~item.roles.indexOf(role)) || !item.roles);
}

function showInNavFilterFn(item) {
  return item.showInNav;
}

function showExceptSadmin(item) {
  console.log(item.path, item.path != 'sadmin');
  return item.path != 'sadmin';
}

export default connect(state => ({
  user: state.user
}))(Navigator);
