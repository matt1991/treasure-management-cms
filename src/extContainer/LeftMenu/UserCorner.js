import React from 'react';
import { Link } from 'react-router';
import { Menu, Dropdown, Icon } from 'antd';
import { push, replace } from 'redux-router';
import {AUTH, ACCOUNT, ROLE, BROADCAST_ROLE_HOST_STR, BROADCAST_ROLE_ASSIST_STR} from '#/extConstants';
import {getLogoutRedirectPathByRole} from '#/utils';

const SubMenu = Menu.SubMenu;

const UserInfo = ({user}) => {
  return (
    <span className="userinfo">
      <span className="avatar">{/*user.getAccount()*/}</span>
      <span className="nav-text">{user.getAccount()}</span>
    </span>
  );
}

export default class UserCorner extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { collapse, user } = this.props;

    const menuProps = {
      mode: collapse ? 'vertical' : 'inline',
      theme: 'dark',
      // openKeys: [],
      // defaultOpenKeys: [],
    };
    const display = [BROADCAST_ROLE_HOST_STR, BROADCAST_ROLE_ASSIST_STR].includes(user.getRole())
      ? 'none' : 'auto';
    const passwdModificationMenuStyle = {style : {display: display}};
    return (
      <div className="user-corner">
        <Menu {...menuProps}>
          <SubMenu key="user" title={<UserInfo user={user} />}>
            {/* <Menu.Item key="1">
              <div onClick={this.setPeference}>偏好设置</div>
            </Menu.Item> */}
            {/*<Menu.Item key="2" {...passwdModificationMenuStyle} >
              <Link to='/account/profile'>修改密码</Link>
            </Menu.Item>*/}
            <Menu.Item key="3">
              <div onClick={this.clearToken}>退出登录</div>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }

  setPeference = e => {
    this.props.dispatch({
      type: 'preference_modal/show'
    });
  }

  clearToken = e => {
    localStorage.removeItem(AUTH);
    localStorage.removeItem(ACCOUNT);
    let role = localStorage.getItem(ROLE);
    localStorage.removeItem(ROLE);
    window.location = getLogoutRedirectPathByRole(role);
    // this.props.dispatch(push({
    //   pathname: '/login',
    //   state: { nextPathname: this.props.location.pathname }
    // }));
  }
}
