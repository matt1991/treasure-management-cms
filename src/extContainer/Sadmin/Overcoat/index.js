import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router';
import { push } from 'redux-router';
import { NavCollapse } from '#/extConstants';
import { parseValue } from '#/utils';
import {SU_ACCOUNT, SU_AUTH} from '#/extConstants';

import styles from './styles.scss';

import Navigator from './Navigator';
import UserCorner from './UserCorner';

import HelperModals from './HelperModals';

@connect(state => ({
  user: state.sauser,
  detail: {
    data: {},
    loading: false,
    cacheable: false,
    leaveEnsure: false,
  },
  overcoat: state.saovercoat,
}))
export default class Overcoat extends React.Component {
  constructor(props) {
    super(props);
    let collapse = localStorage.getItem(NavCollapse);
    this.state = {
      collapse: parseValue(collapse),
    };
  }

  componentDidMount() {
    if (!this.props.user.account) {
      this.props.dispatch({type: 'sauser/self', payload:{
        token:localStorage.getItem(SU_AUTH),
        account:localStorage.getItem(SU_ACCOUNT),
      }});
    }
    // this.props.dispatch({
    //   type: 'topics/get'
    // });
    // this.props.dispatch({
    //   type: 'blocks/get'
    // });
    // this.props.dispatch({
    //   type: 'origin_websites/get'
    // });
  }

  render() {
    const { user, overcoat, detail, dispatch } = this.props;
    const { collapse } = this.state;
    return (
      <div className={collapse ? 'overcoat collapsed' : 'overcoat'}>
        <aside className="overcoat-sidebar">
          <div className="logo flex flex--justify-content--center flex--align-items--center">
            { !collapse && <div className="m-l-1">管理员系统</div> }
          </div>
          <Navigator collapse={collapse} {...this.props} />
          <div className="collapse-btn" onClick={this.onCollapseChange}>
            {
              collapse
                ? <Icon type="right" />
                : <Icon type="left" />
            }
          </div>
          <UserCorner collapse={collapse} {...this.props} />
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
