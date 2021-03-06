import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input } from 'antd';

@Form.create()
@connect(state => ({
  account: state.account,
}))
export default class CloseAccountModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topicSelected: undefined,
    }
  }

  render() {
    const { overcoat, form } = this.props;
    const modalConfig = this.getModalConfig();




    return (
      <Modal visible={overcoat.closeAccountModal} {...modalConfig}>
        是否确认禁用该用户
      </Modal>
    );
  }

  handleChange = e => {
    this.setState({
      topicSelected: e.target.value,
    });
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
      title: "禁用房间",
      onCancel: this.close,
      maskClosable: false,
    };
  }

  next = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;
    const { topicEvent: event } = overcoat;
    console.log("submit close Account");

    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      const { topicSelected } = form.getFieldsValue();

      event && this.props.dispatch({
        type: `${event}/succeeded`,
        payload: { topicSelected }
      });
    });
  }

  close = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;

    this.props.dispatch({
      type: 'sadmin/manage/closeAccount_modal/show/failed'
    });
  }
}
