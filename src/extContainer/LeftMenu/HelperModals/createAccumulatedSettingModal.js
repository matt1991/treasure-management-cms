import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input,Icon,Checkbox,  Row, Col, Select, TimePicker,DatePicker} from 'antd';
const Option = Select.Option;
import moment from 'moment';
import { accumulatedLotterySettingToServerData, accumulatedLotterySettingToLocalData } from '#/utils/dataProcessor';
import { RULE_MAP} from '#/extConstants';



@Form.create()
@connect(state => ({
  account: state.account,
}))
export default class CreateAccumulatedSettingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { overcoat, form } = this.props;
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
      <Modal visible={overcoat.createAccumulatedSettingModal} {...modalConfig}>
         <Form layout="horizontal">
            <Form.Item label="名字"  {...formItemLayout} >
                {getFieldDecorator('name',{rules:[{required:true,message:'请输入名字'}]})(<Input placeholder="请输入名字" />)}
            </Form.Item>
            <Form.Item label="开奖规则"  {...formItemLayout} >
              {getFieldDecorator('rule',{rules:[{required:true}], initialValue:"2"})(<Select placeholder="请选择开奖规则" >
                {RULE_MAP.map((rule) => (<Option key={rule.key}>{rule.des}</Option>))}
              </Select>)}
            </Form.Item>
            <Form.Item  label="奖池累计天数" {...formItemLayout} >
                {getFieldDecorator('days',{rules:[{required:true,message:'奖池累计天数'},{validator:this.checkNumber}]})(<Input type="string" onChange={this.onPeriodChange} placeholder="累计天数" />)}
            </Form.Item>
            <Form.Item style={{display:"none"}} label="奖池累计时间(秒)" {...formItemLayout} >
                {getFieldDecorator('period',{rules:[{required:true,message:'奖池累计时间'}]})(<Input  type="string"  />)}
            </Form.Item>
            <Form.Item  label="自动开奖" {...formItemLayout} >
                {getFieldDecorator('auto_open',{rules:[{required:false}]})(<Checkbox />)}
            </Form.Item>
            <Form.Item  label="自动续期" {...formItemLayout} >
                {getFieldDecorator('auto_renew',{rules:[{required:false}]})(<Checkbox />)}
            </Form.Item>
            <Form.Item  label="生效时间" {...formItemLayout} >
                {getFieldDecorator('effect_time',{rules:[{required:true}]})(<DatePicker onChange={this.onEffectTimeChange} format="YYYY-MM-DD HH:mm:ss"  showTime />)}
            </Form.Item>
            <Form.Item  label="截止时间" {...formItemLayout} >
                {getFieldDecorator('end_time',{rules:[{required:true}]})(<DatePicker disabled format="YYYY-MM-DD HH:mm:ss" showTime />)}
            </Form.Item>
            <Form.Item  label="份额单价" {...formItemLayout} >
                {getFieldDecorator('unit_price',{rules:[{required:true,message:'请输入份额单价'},{validator:this.checkNumber}]})(<Input type="string" placeholder="份额单价" />)}
            </Form.Item>
            <Form.Item  label="游戏杀数" {...formItemLayout} >
                {getFieldDecorator('lucky_rate',{rules:[{required:true,message:'请输入杀数'},{validator:this.checkFloat}]})(<Input type="string" placeholder="游戏杀数" />)}
            </Form.Item>
        </Form>
      </Modal>
    );
  }

  onEffectTimeChange = (value, dateString) => {
    const days = this.props.form.getFieldsValue().days;
    let result =0;
    if (days && days !== "" && parseInt(days)) {
      result = value.valueOf() + parseInt(days) * 24*60*60*1000;
      this.props.form.setFieldsValue({"end_time":new moment(result)});
    }

  }

  onPeriodChange = (e) => {
    e.preventDefault();
    const effect_time = this.props.form.getFieldsValue().effect_time;
    const days = parseInt(e.target.value);
    let result = 0;
    if (days) {
      this.props.form.setFieldsValue({"period": days*24*60*60*1000})
    }

    if (effect_time && days) {
      result = effect_time.valueOf() + days* 24 *60*60*1000;
      this.props.form.setFieldsValue({"end_time":new moment(result)});
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




  checkConfirmPwd = (rule, value, callback) => {
    const {form} = this.props;
    if (value) {
      const password = form.getFieldValue('new_password');
      if (value && value !== password) {
        callback(new Error('输入的密码不一致'));
      } else {
        callback();
      }
    } else {
      callback();
    }
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
console.log("validateFieldsAndScroll");
    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      const formValue = form.getFieldsValue();
      // console.log(formValue);
      // console.log(formValue.effect_time.valueOf());
      // console.log(formValue.effect_time.format('HH:mm:ss'));
      // let serverdata = accumulatedLotterySettingToServerData(formValue);
      // console.log(serverdata);
      // console.log(accumulatedLotterySettingToLocalData(serverdata));
      this.props.dispatch({
        type:`accumulatedLottery/setting/add`,
        payload:accumulatedLotterySettingToServerData(formValue)
      })

      this.props.dispatch({
        type: 'overcoat/createAccumulatedSetting_modal/close'
      });
    });
  }

  close = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;

    this.props.dispatch({
      type: 'overcoat/createAccumulatedSetting_modal/close'
    });
  }
}
