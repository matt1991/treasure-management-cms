import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input,Icon,Checkbox} from 'antd';

@Form.create()
@connect(state => ({
  account: state.account,

}))
export default class EditAccountModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topicSelected: undefined,
    }
  }

  render() {
    const { overcoat, form } = this.props;
    const modalConfig = this.getModalConfig();
    const formItemLayout = {
      labelCol: {span:6},
      wrapperCol: {span:14},
    }

    const {editAccount} = overcoat;
    const {getFieldDecorator} = form;
    console.log(overcoat);

    return (
      <Modal visible={overcoat.editAccountModal} {...modalConfig}>
         <Form>
          <Form.Item  {...formItemLayout} >
              {getFieldDecorator('username',{initialValue:editAccount.userName,rules:[{required:true,message:'请输入管理员账号'},{validator:this.checkAdminAccount}]})(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入管理员帐号" />)}
          </Form.Item>
          <Form.Item  {...formItemLayout} >
              {getFieldDecorator('password',{rules:[{required:true,message:'请输入密码'}]})(<Input type="password" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="请输入密码" />)}
          </Form.Item>
          <Form.Item  {...formItemLayout} >
            {getFieldDecorator('confirmPwd',{rules:[{required:true,message:'请输入密码'},{validator:this.checkConfirmPwd}]})(<Input type="password" prefix={<Icon type="lock" style={{ fontSize: 13 }} />}  onPaste={false} onCopy={false} onCut={false} placeholder="请确认新密码" />)}
          </Form.Item>
          <Form.Item label="权限" {...formItemLayout}>
            {getFieldDecorator('canForbidUser',{valuePropName: 'checked',initialValue:editAccount.canForbidUser})(<Checkbox >禁用用户</Checkbox>)}
          </Form.Item>
          <Form.Item {...formItemLayout}>
            {getFieldDecorator('canModifyBalance',{valuePropName: 'checked',initialValue:editAccount.canModifyBalance})(<Checkbox >修改余额</Checkbox>)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  getModalConfig = () => {
    const quitBtnConfig = {
      key: 'quit',
      title: '退出',
      type: 'default',
      onClick: this.close,
    };

    const nextBtnConfig = {
      key: 'ignore',
      title: '确认',
      // disabled: !this.props.form.getFieldsValue().topicSelected,
      type: 'primary',
      // loading: loading,
      onClick: this.next,
    };

    const footer = [
      <Button {...quitBtnConfig}>{quitBtnConfig.title}</Button>,
      <Button {...nextBtnConfig}>{nextBtnConfig.title}</Button>,
    ];

    return {
      footer,
      width: 600,
      title: "编辑账户",
      onCancel: this.close,
      maskClosable: false,
    };
  }




  checkAdminAccount = (rule, value, callback) => {
    if (value) {
      if (/^[A-Za-z0-9_]+$/.test(value)) {
        callback();
      } else {
        callback(new Error("帐号不能包含特殊字符"));
      }
    } else {
      callback();
    }
  }

  checkConfirmPwd = (rule, value, callback) => {
    const {form} = this.props;
    if (value) {
      const password = form.getFieldValue('password');
      if (value && value !== password) {
        callback(new Error('输入的密码不一致'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  next = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;
    const { topicEvent: event } = overcoat;

    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      const formValue = form.getFieldsValue();
      let value = Object.assign({id:overcoat.editAccount.id}, values);
      this.props.dispatch({
        type:'samanage/edit',
        payload:value
      })
    });
  }

  close = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;

    this.props.dispatch({
      type: 'sadmin/manage/editAccount_modal/show/failed'
    });
  }
}
