import React from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import { Menu, Icon } from 'antd';


import { rootChildRoutes }  from '#/extRoutes';




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
            <Menu.Item key={`/sadmin/${menu.path}`}>
              {menu.name}
            </Menu.Item>
  );
}


const Navigator = ({ user, collapse, routes, dispatch }) => {


  const roleFilterFn = roleFilterGen(user.role);

  const navRoutes = rootChildRoutes.filter(showSadmin).pop().childRoutes.filter(showInNavFilterFn);
  const availableNavs = navRoutes.filter(roleFilterFn).map(item => ({
    path: item.path,
    name: item.breadcrumbName,
    icon: item.icon,
    subRoutes: item.childRoutes.filter(showInNavFilterFn).filter(roleFilterFn).map(n => ({
      path:n.path,
      name:n.breadcrumbName,
    })),
  }));
  const defaultOpenKeys = collapse ? [] : navRoutes.map(item => item.path);
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
  return (
    <Menu {...menuProps}>
      <Menu.SubMenu key={`/sadmin/`} title={<Text text="管理"/>}>
      {
        availableNavs.map((item, index) => NavMenuItem(item))
      }
      </Menu.SubMenu>
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
  return item => ((item.roles && ~item.roles.indexOf(role)) || !item.roles);
}

function showInNavFilterFn(item) {
  return item.showInSadminNav;
}

function showSadmin(item) {
  return item.path == 'sadmin';
}

function handleClick(item) {
}

export default connect(state => ({
  user: state.sauser
}))(Navigator);
