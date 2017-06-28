//管理员个人账号显示

import React from 'react';
import { connect } from 'react-redux';

import { Form, Input, Button, Checkbox, Radio, Tooltip, Icon } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(state => ({
  user : state.user,
}))
@Form.create()
export default class ProfilePane extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      isEdit : false,//根据其来判断是否是修改密码
    };
  }

  componentDidMount() {
    //TODO: set the user info
    //TIPS: user info 其实可以在最上层state传递过来，props在本身组件无法使用 http://itbilu.com/javascript/react/4k5RfzDKx.html
    //可以使用replaceProps来替换
    this.props.dispatch({type : 'user/self', payload :{
      account : this.props.user.getAccount(),
      token   : this.props.user.getToken()
    }});
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
        <Form style={{width:400}}>
          <FormItem
            id="control-input"
            label="账 号"
            {...formItemLayout}
          >
          {getFieldDecorator('account')(<Input disabled={true}  id="control-input" type="text" placeholder={this.props.user.account} />)}

          </FormItem>
          <FormItem
            id="control-input"
            label="密码"
            {...formItemLayout}
          >
          {getFieldDecorator('password')(<Input disabled={!this.state.isEdit} id="control-input"
          type="password" placeholder={this.state.isEdit ? '请输入旧密码': `*********`} />)}
          </FormItem>
          {
            this.state.isEdit ?
              <FormItem
                id="control-input"
                label="新密码"
                {...formItemLayout}
              >
              {getFieldDecorator('new_password')(<Input disabled={!this.state.isEdit} id="control-input" type="password" placeholder="请输入新密码"/>)}
              </FormItem>
              : null
          }
          {
            this.state.isEdit ?
              <FormItem
                        id="control-input"
                        label="确认密码"
                        {...formItemLayout}
              >
                {getFieldDecorator('new_password_2')(<Input disabled={!this.state.isEdit} id="control-input" type="password" placeholder="请再次输入新密码" />)}
              </FormItem>
              : null
          }
          {
            !this.state.isEdit ?
              <FormItem wrapperCol={{offset: 6 }}>
                <Button type="primary" onClick={::this.handleModifyBtn}>修改</Button>
              </FormItem>
            :
              <FormItem wrapperCol={{offset: 6 }}>
                <Button onClick={::this.handleCancelBtn} style={{marginRight: 10}}>取消</Button>
                <Button type="primary" onClick={::this.handleSubmit}>确定</Button>
              </FormItem>
          }
        </Form>
    );
  }

  //函数实现
  handleModifyBtn(){
    this.setState({isEdit : true});//会触发rerender
  //  this.state.isEdit = true;
    console.log(this.state);
  }

  handleCancelBtn(){
    this.setState({isEdit : false});
  }

  handleSubmit(e) {
    e.preventDefault();
    let payload = this.props.form.getFieldsValue();
    //console.log('收到表单值：', this.props.form.getFieldsValue());
    if(!payload.password){
      this.props.dispatch({type:'notify/error', payload : '请输入旧密码'});
      return;
    }
    if(payload.new_password_2 != payload.new_password){
      this.props.dispatch({type:'notify/error', payload : '请输入相同的新密码'});
      return;
    }

    payload.resolve = () => {this.setState({isEdit:false})};
    this.props.dispatch({type:'user/changepwd', payload:payload});
  }
}
