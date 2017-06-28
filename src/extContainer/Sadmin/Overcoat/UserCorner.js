import React from 'react';
import { Link } from 'react-router';
import { Menu, Dropdown, Icon } from 'antd';
import { push } from 'redux-router';
import {SU_ACCOUNT, SU_AUTH, ROLE} from '#/extConstants';

const SubMenu = Menu.SubMenu;

const UserInfo = ({user}) => {
  return (
    <span className="userinfo">
      <span className="avatar">{"SU"}</span>
      <span className="nav-text">{user.account}</span>
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

    return (
      <div className="user-corner">
        <Menu {...menuProps}>
          <SubMenu key="user" title={<UserInfo user={user} />}>
            {/*<Menu.Item key="1">
              <div onClick={this.setPeference}>偏好设置</div>
            </Menu.Item>*/}
            <Menu.Item key="2">
              <div onClick={this.changepwd}>修改密码</div>
            </Menu.Item>
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

  changepwd = e => {
    e.preventDefault();
    this.props.dispatch({
      type: 'sadmin/changepwd_modal/show'
    })
  }

  clearToken = e => {
    localStorage.removeItem(SU_AUTH);
    localStorage.removeItem(SU_ACCOUNT);
    localStorage.removeItem(ROLE);
    window.location = '/sadmin/login';
  }
}
