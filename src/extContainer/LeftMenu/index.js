import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Icon} from 'antd';
import { Link } from 'react-router';
import { push } from 'redux-router';
import { NavCollapse } from '#/extConstants';
import { parseValue } from '#/utils';

import styles from './styles.scss';

import Navigator from './Navigator';
import UserCorner from './UserCorner';
import HelperModals from './HelperModals';

import {ROLE_ADMIN, BROADCAST_ROLE_HOST_STR, BROADCAST_ROLE_ASSIST_STR} from '#/extConstants';

@connect(state => ({
  user: state.user,
  detail: {
    data: {},
    loading: false,
    cacheable: false,
    leaveEnsure: false,
  },
  overcoat:state.overcoat,
  notify:state.notify,
}))
export default class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    let collapse = localStorage.getItem(NavCollapse);
    this.state = {
      collapse: parseValue(collapse),
    };
  }

  componentDidMount() {
    console.debug('leftmenu componentdidmount');

    if (!this.props.user.account) {
      if (this.props.user.getRole() == 'admin'){
        console.debug('role == admin');
        this.props.dispatch({type : 'user/self', payload :{
          account : this.props.user.getAccount(),
          token   : this.props.user.getToken()
        }});
      }
      else if ([BROADCAST_ROLE_HOST_STR, BROADCAST_ROLE_ASSIST_STR].includes(this.props.user.getRole())){
        console.debug('role ==', this.props.user.getRole());
        this.props.dispatch({type : 'user/checkIn', payload :{
          account : this.props.user.getAccount(),
          token   : this.props.user.getToken()
        }});
      } else if(this.props.user.getRole() == 'agent') {
        this.props.dispatch({type : 'user/agent/self', payload :{
          account : this.props.user.getAccount(),
          token   : this.props.user.getToken()
        }});
      }
      else{
        console.debug('role ==', this.props.user.getRole());
        console.debug('user/isMUser');
        this.props.dispatch({type : 'user/isMUser', payload :{
          account : this.props.user.getAccount(),
          token   : this.props.user.getToken()
        }});
      }
    }
  //  this.props.dispatch({type :'wsconn/createNewConn'});
  }

  render() {
    const { user, overcoat, detail, dispatch } = this.props;
    const { collapse } = this.state;
    //console.debug(this.props, parent);
    const menuHeadTitle = user.getRole() == ROLE_ADMIN ? '管理员系统' : '代理后台';
    return (
      <div className={collapse ? 'overcoat collapsed' : 'overcoat'}>
        <aside className="overcoat-sidebar">
          <div className="logo flex flex--justify-content--center flex--align-items--center">
            { !collapse && <div className="m-l-1">{menuHeadTitle}</div> }
          </div>

          <Navigator collapse={collapse} {...this.props}/>
          <div className="collapse-btn" onClick={this.onCollapseChange}>
            {
              collapse
                ? <Icon type="right" />
                : <Icon type="left" />
            }
          </div>
          {
            user.getRole() == 'admin' || 'agent' ||
            user.getRole() == BROADCAST_ROLE_HOST_STR ||
            user.getRole() == BROADCAST_ROLE_ASSIST_STR ? <UserCorner collapse={collapse} {...this.props} /> : null
          }

        </aside>
        <main className="overcoat-main">
          <Breadcrumb separator="/" {...this.props} itemRender={this.itemRender} />
          <div className="content-wrapper">
            { this.props.children }
          </div>
          <HelperModals {...this.props} />
        </main>
      </div>
    )
  }

  // linkRender = (href, name) => {
  //   return <Link to={href}>{name}</Link>;
  // }

  itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? <span>{route.breadcrumbName}</span> : <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
  }

  onCollapseChange = () => {
    this.setState({
      collapse: !this.state.collapse,
    }, () => localStorage.setItem(NavCollapse, this.state.collapse));
  }

  closePreviewer = () => {
    this.props.dispatch({
      type: 'previewer/hide'
    });
  }
}
