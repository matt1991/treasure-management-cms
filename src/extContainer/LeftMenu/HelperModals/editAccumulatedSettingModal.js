import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input,Icon,Checkbox,  Row, Col, Select, TimePicker,DatePicker,Upload} from 'antd';
const Option = Select.Option;
import moment from 'moment';
import { accumulatedLotterySettingToServerData, accumulatedLotterySettingToLocalData } from '#/utils/dataProcessor';
import { RULE_MAP} from '#/extConstants';



@Form.create()
@connect(state => ({
  account: state.account,
  overcoat: state.overcoat
}))
export default class EditAccumulatedSettingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { overcoat, form } = this.props;
    const {editAccumulatedSetting} = overcoat;
    let oriEditAccumulatedSetting = accumulatedLotterySettingToLocalData(editAccumulatedSetting);
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
      <Modal visible={overcoat.editAccumulatedSettingModal} {...modalConfig}>
         <Form layout="horizontal">
           <Form.Item label="ID"  {...formItemLayout} >
               {getFieldDecorator('id',{rules:[{required:true}], initialValue:oriEditAccumulatedSetting.id})(<Input disabled />)}
           </Form.Item>
            <Form.Item label="名字"  {...formItemLayout} >
                {getFieldDecorator('name',{rules:[{required:true,message:'请输入名字'}], initialValue:oriEditAccumulatedSetting.name})(<Input placeholder="请输入名字" />)}
            </Form.Item>
            <Form.Item label="开奖规则"  {...formItemLayout} >
              {getFieldDecorator('rule',{rules:[{required:true}], initialValue:"2"})(<Select disabled placeholder="请选择开奖规则" >
                {RULE_MAP.map((rule) => (<Option key={rule.key}>{rule.des}</Option>))}
              </Select>)}
            </Form.Item>
            <Form.Item  label="奖池累计天数" {...formItemLayout} >
                {getFieldDecorator('days',{rules:[{required:true,message:'奖池累计天数'},{validator:this.checkNumber}], initialValue:oriEditAccumulatedSetting.days})(<Input type="string" onChange={this.onPeriodChange} placeholder="累计天数" />)}
            </Form.Item>
            <Form.Item style={{display:"none"}} label="奖池累计时间(秒)" {...formItemLayout} >
                {getFieldDecorator('period',{rules:[{required:true,message:'奖池累计时间'}], initialValue:oriEditAccumulatedSetting.period})(<Input  type="string"  />)}
            </Form.Item>
            <Form.Item  label="自动开奖" {...formItemLayout} >
                {getFieldDecorator('auto_open',{rules:[{required:false}],initialValue:oriEditAccumulatedSetting.auto_open})(<Checkbox defaultChecked={oriEditAccumulatedSetting.auto_open} />)}
            </Form.Item>
            <Form.Item  label="自动续期" {...formItemLayout} >
                {getFieldDecorator('auto_renew',{rules:[{required:false}], initialValue:oriEditAccumulatedSetting.auto_renew})(<Checkbox defaultChecked={oriEditAccumulatedSetting.auto_renew} />)}
            </Form.Item>
            <Form.Item  label="份额单价" {...formItemLayout} >
                {getFieldDecorator('unit_price',{rules:[{required:true,message:'请输入份额单价'},{validator:this.checkNumber}], initialValue:oriEditAccumulatedSetting.unit_price})(<Input type="string" placeholder="份额单价" />)}
            </Form.Item>
            <Form.Item  label="游戏杀数" {...formItemLayout} >
                {getFieldDecorator('lucky_rate',{rules:[{required:true,message:'请输入杀数'},{validator:this.checkFloat}], initialValue:oriEditAccumulatedSetting.lucky_rate})(<Input type="string" placeholder="游戏杀数" />)}
            </Form.Item>
        </Form>
      </Modal>
    );
  }

  onPeriodChange = (e) => {
    e.preventDefault();
    const days = parseInt(e.target.value);
    if (days) {
      this.props.form.setFieldsValue({"period": days*24*60*60*1000})
    }

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

    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      const formValue = form.getFieldsValue();
      this.props.dispatch({
        type:`accumulatedLottery/setting/update`,
        payload:accumulatedLotterySettingToServerData(formValue)
      })
      this.props.dispatch({
        type: 'overcoat/editAccumulatedSetting_modal/close',
        payload:{editAccumulatedSetting:{}}
      });
    });
  }

  close = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;

    this.props.dispatch({
      type: 'overcoat/editAccumulatedSetting_modal/close',
      payload:{editAccumulatedSetting:{}}
    });
  }
}
