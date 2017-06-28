import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input,Icon,Checkbox,  Row, Col, Select, TimePicker,DatePicker} from 'antd';
const Option = Select.Option;
import moment from 'moment';
import { timelyLotterySettingToServerData, timelyLotterySettingToLocalData } from '#/utils/dataProcessor';



@Form.create()
@connect(state => ({
  account: state.account,
  overcoat: state.overcoat
}))
export default class EditTimelySettingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { overcoat, form } = this.props;
    const {editTimelySetting} = overcoat;
    const modalConfig = this.getModalConfig();
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const {getFieldDecorator} = form;

    return (
      <Modal visible={overcoat.editTimelySettingModal} {...modalConfig}>
         <Form layout="horizontal">
            <Form.Item label="名字"  {...formItemLayout} >
                {getFieldDecorator('name',{rules:[{required:true,message:'请输入名字'}], initialValue:editTimelySetting.name})(<Input placeholder="请输入名字" />)}
            </Form.Item>
            <Form.Item label="开奖规则"  {...formItemLayout} >
                {getFieldDecorator('rule',{rules:[{required:true}], initialValue:editTimelySetting.rule})(<Select placeholder="请选择开奖规则" >
                  <Option key="1">重庆时时彩</Option>
                  <Option key="2">下注时间</Option>
                  <Option key="3">重庆时时彩没有数据用下注时间</Option>
                </Select>)}
            </Form.Item>
            <Form.Item  label="奖池累计天数" {...formItemLayout} >
                {getFieldDecorator('period',{rules:[{required:true,message:'请再次输入密码'},{validator:this.checkNumber}], initialValue:editTimelySetting.period})(<Input type="string" placeholder="累计天数" />)}
            </Form.Item>
            <Form.Item  label="截止时间" {...formItemLayout} >
                {getFieldDecorator('end_time',{rules:[{required:true,message:'请输入电话'}]})(<TimePicker defaultValue={moment(editTimelySetting.end_time, 'HH:mm:ss')} size="large" />)}
            </Form.Item>
            <Form.Item  label="自动开奖" {...formItemLayout} >
                {getFieldDecorator('auto_open',{rules:[{required:true}]})(<Checkbox defaultChecked={editTimelySetting.auto_open} />)}
            </Form.Item>
            <Form.Item  label="自动续期" {...formItemLayout} >
                {getFieldDecorator('auto_renew',{rules:[{required:true}]})(<Checkbox defaultChecked={editTimelySetting.auto_renew} />)}
            </Form.Item>
            <Form.Item  label="份额单价" {...formItemLayout} >
                {getFieldDecorator('unit_price',{rules:[{required:true,message:'请输入份额单价'},{validator:this.checkNumber}], initialValue:editTimelySetting.unit_price})(<Input type="string" placeholder="份额单价" />)}
            </Form.Item>
            <Form.Item  label="游戏杀数" {...formItemLayout} >
                {getFieldDecorator('lucky_rate',{rules:[{required:true,message:'请输入杀数'},{validator:this.checkFloat}], initialValue:editTimelySetting.lucky_rate})(<Input type="string" placeholder="游戏杀数" />)}
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
      title: "新建配置",
      onCancel: this.close,
      maskClosable: false,
    };
  }


  checkNumber = (rule, value, callback) => {
    const {form} = this.props;
    if (value) {
      if (value !== parseInt(value)+"") {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  checkFloat = (rule, value, callback) => {
    const {form} = this.props;
    if (value) {
      if (value !== parseFloat(value)+"") {
        callback(new Error('请输入数字'));
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
    const { editMember } = overcoat;

    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      const formValue = form.getFieldsValue();
      this.props.dispatch({
        type:`timelyLottery/settings/update`,
        payload:timelyLotterySettingToServerData(formValue)
      })
      this.props.dispatch({
        type: 'overcoat/editTimelySetting_modal/close',
        payload:{editTimelySetting:{}}
      });
    });
  }

  close = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;

    this.props.dispatch({
      type: 'overcoat/editTimelySetting_modal/close',
      payload:{editTimelySetting:{}}
    });
  }
}
