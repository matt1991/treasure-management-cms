import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Button} from 'antd';
import styles from '../styles.scss';


const Field = ({field}) => {
  return (
    <span className={styles.Field}>
      <span className="key">{field}</span>
      <span>：</span>
    </span>
  )
}

@connect(state => ({
  samanage:state.samanage
}))
export default class Edit extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.loadAccountInfo();
  }


  render() {
    const {samanage} = this.props;
    let detailAccount = samanage.detailAccount;
    console.log("render",detailAccount);
    return (
      <div className="sadmin-container">
        <div>
          <Field field="产品号"/>
          <span>{detailAccount.pid}</span>
        </div>
        <div>
          <Field field="公司名称"/>
          <span>{detailAccount.company}</span>
        </div>
        <div>
          <Field field="APP ID"/>
          <span>{detailAccount.appId}</span>
        </div>
        <div>
          <Field field="公司密钥"/>
          <span>{detailAccount.desKey}</span>
        </div>
        <div>
          <Field field="管理员帐号"/>
          <span>{detailAccount.adminAccount}</span>
        </div>
        {/*<div>
          <Field field="公司邮箱"/>
          <span>{detailAccount.email}</span>
        </div>
        <div>
          <Field field="公司电话"/>
          <span>{detailAccount.tel}</span>
        </div>*/}
        <div className="footer">
          <Button type="primary" size="large" onClick={this.handleEdit}  style={{marginRight:20}}>修改</Button>
          <Button type="primary" size="large" onClick={this.handleGoBack} >返回</Button>
        </div>
      </div>
    )
  }

  handlechangepwd = e => {
    e.preventDefault();
    // this.props.dispatch({
    //   type: 'changepwd_modal/show'
    // });
  }

  handleEdit = e => {
    e.preventDefault();
    this.props.dispatch(push(`/sadmin/manage/edit/${this.props.params.id}`))
  }

  handleGoBack = e => {
    e.preventDefault();
    this.props.dispatch(push(`/sadmin/manage/list`));
  }

  loadAccountInfo = () => {
    this.props.dispatch({
      type:'samanage/detailAccount',
      payload: {id:this.props.routeParams.id}
    });
  }


}
