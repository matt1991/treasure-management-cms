import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input } from 'antd';

@Form.create()
@connect(state => ({
  account: state.account,
}))
export default class ChangePWDModal extends React.Component {
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

    return (
      <Modal visible={overcoat.changepwdModal} {...modalConfig}>
         <Form>
           <Form.Item label="旧密码" {...formItemLayout} >
               <Input type="password" {...form.getFieldProps('old_pwd', { initialValue: '', rules:[{type:"string", required:true, message:"请输入密码"}]})} placeholder="请输入旧密码" />
           </Form.Item>
          <Form.Item label="新密码" {...formItemLayout} >
              <Input type="password" {...form.getFieldProps('new_pwd', { initialValue: '', rules:[{type:"string", required:true, message:"请输入新密码"}, {min:6, message:"请输入至少六位新密码"}, { validator: this.checkNewPwd }] })} placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item label="确认密码" {...formItemLayout} >
              <Input type="password" {...form.getFieldProps('new_pwd_2', { initialValue: '',rules:[{type:"string", required:true, message:"请输入新密码"},{min:6, message:"请输入至少六位新密码"}, { validator: this.checkAGPwd }] })} placeholder="请确认新密码" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  handleChange = e => {
    this.setState({
      topicSelected: e.target.value,
    });
  }

  checkNewPwd = (rule, value, callback) => {
    const { getFieldsValue } = this.props.form;
    let formValues = getFieldsValue();
    if (value && value == formValues['old_pwd']) {
      callback("新密码不能和旧密码一样");
    } else {
      callback();
    }

  }
  checkAGPwd = (rule, value, callback) => {
    const { getFieldsValue } = this.props.form;
    let formValues = getFieldsValue();
    const {new_pwd} = formValues;
    if (new_pwd && !new_pwd.includes(formValues['new_pwd_2'])) {
      callback("两次密码输入不一致");
    } else {
      callback();
    }

  }



  getModalConfig = () => {
    const quitBtnConfig = {
      key: 'quit',
      title: '取消',
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
      title: "修改密码",
      onCancel: this.close,
      maskClosable: false,
    };
  }

  next = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      const payload = form.getFieldsValue();
      //TODO:作两次新密码验证;
      if(payload.new_pwd != payload.new_pwd_2){
        console.warn(payload);
        this.props.dispatch({type:'notify/error', payload:'两次输入密码不一致'});
        return;
      }
      console.debug('#####', payload);
      this.props.dispatch({
        type: 'sauser/changepwd',
        payload: {
          password : payload.old_pwd,
          new_password : payload.new_pwd,
          resolve : () =>{
            this.props.dispatch({type: 'sadmin/changepwd_modal/show/succeeded'});
          }
        }
      });

    });
  }

  close = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;

    this.props.dispatch({
      type: 'sadmin/changepwd_modal/show/failed'
    });
  }
}
