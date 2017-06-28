import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input } from 'antd';

@Form.create()
@connect(state => ({
  account: state.account,
}))
export default class OpenConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topicSelected: undefined,
    }
  }

  render() {
    const { overcoat, form } = this.props;
    const modalConfig = this.getModalConfig();

    const quitBtnConfig = {
      key: 'quit',
      title: '确认',
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


    return (
      <Modal visible={overcoat.openConfirmModal} {...modalConfig}>
        <Button {...nextBtnConfig}>{nextBtnConfig.title}</Button>
        <Button {...quitBtnConfig}>{quitBtnConfig.title}</Button>,
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

    return {
      width: 600,
      title: "修改密码",
      onCancel: this.close,
      maskClosable: false,
    };
  }

  next = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;
    const { topicEvent: event } = overcoat;

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
    //const { overcoat, form } = this.props;

    this.props.dispatch({
      type: 'sadmin/room/openConfirm_modal/show/failed'
    });
  }
}
