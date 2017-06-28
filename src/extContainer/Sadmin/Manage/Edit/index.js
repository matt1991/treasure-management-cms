import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Button, Form, Input, Modal} from 'antd';
import styles from '../styles.scss';

const FormItem = Form.Item;

const formItemLayout = {
       labelCol: { span: 2},
       wrapperCol: { span: 6 },
    };


const Field = ({field}) => {
  return (
    <span className={styles.Field}>
      <span className="key">{field}</span>
      <span>：</span>
    </span>
  )
}

@Form.create()
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
    const {samanage, form} = this.props;
    let {detailAccount} = samanage;
    return (
      <div className="sadmin-container">
      <Form>
        <div>
          <Field field = "产品号"/>
          <span>{detailAccount.pid}</span>
        </div>
        <div>
          <Field field="公司名称"/>
          <span>{detailAccount.company}</span>
        </div>
        <div>
          <Field field="管理员帐号"/>
          <FormItem className="inline"><Input className="inputbox" {...form.getFieldProps('adminAccount', { initialValue: detailAccount.adminAccount })}  placeholder="管理员帐号"/></FormItem>
        </div>
        {/*<div>
          <Field field="公司邮箱"/>
          <FormItem className="inline"><Input className="inputbox" type="email" {...form.getFieldProps('email', { initialValue: '' , rules:[{type:"email", message:"请输入正确邮箱"}]})} placeholder="公司邮箱"/></FormItem>
        </div>
        <div>
          <Field field="公司电话"/>
          <FormItem className="inline"><Input className="inputbox" {...form.getFieldProps('tel', { initialValue: ''})} placeholder="公司电话"/></FormItem>
        </div>*/}
        <div>
          <Field field="新密码"/>
          <FormItem className="inline"><Input className="inputbox" type="password" {...form.getFieldProps('pass', { initialValue: ''})} placeholder="密码"/></FormItem>
        </div>
        <div>
          <Field field="确认密码"/>
          <FormItem className="inline"><Input className="inputbox" type="password" {...form.getFieldProps('repass', { initialValue: ''})}  onPaste={false} onCopy={false} onCut={false} placeholder="确认密码"/></FormItem>
        </div>

        <div className="footer">
          <Button type="primary" size="large"  style={{marginRight:20}} onClick={this.handleSubmit}>提交</Button>
          <Button type="primary" size="large" onClick={this.handleGoBack} >返回</Button>
        </div>
        </Form>
      </div>
    )
  }

  handleSubmit = e => {
    e.preventDefault();
    const {samanage, form} = this.props;
    let {detailAccount} = samanage;
    let payload = {...this.props.form.getFieldsValue(), pid:detailAccount.pid, company: detailAccount.company};
    if (payload.pass && payload.pass !== payload.repass) {
      Modal.warning({
        title: '修改密码',
        content: '两次密码输入不一致',
      });
      return;
    }

     this.props.dispatch({
       type: 'samanage/edit',
       payload:{...detailAccount, ...payload}
     });
  }


  handleGoBack = e => {
    e.preventDefault();
    this.props.dispatch(push(`/sadmin/manage/list`));
  }

  loadAccountInfo = () => {
    console.log("detailAccount");
    this.props.dispatch({
      type:'samanage/detailAccount',
      payload: {id:this.props.routeParams.id}
    });
  }


}
