import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Wrapper from './Wrapper';
import { Input, Button, Form } from 'antd';

@Form.create()
@connect(state => ({}))
export default class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {form} = this.props;

    return (
      <Wrapper title="">
        <Form>
          <Form.Item>
            <Input type="text" size="large" autoComplete="off" placeholder="请输入帐号" {...form.getFieldProps('account', {rules:[
              { required: true, min:1, message:'请输入帐号'}

            ]})} />
          </Form.Item>
          <Form.Item>
            <Input type="password" size="large" autoComplete="off" placeholder="请输入密码" {...form.getFieldProps('password', {rules:[
              { required: true, min:1, message:'请输入密码'}

            ]})} />
          </Form.Item>
          <Button
            key="submit"
            style={{marginTop: 10, width:200}}
            type="primary"
            htmlType='submit'
            size="large"
            onClick={this.handleSubmit}>

          登录
          </Button>
        </Form>
      </Wrapper>
    );
  }


  handleSubmit = e => {
    e.preventDefault();
    const {form, dispatch} = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;

      const {account, password} = form.getFieldsValue();

      console.debug("login***", account, password);

      dispatch({type : 'user/login', payload : {account : account, password : password}});
    });
  }
}
