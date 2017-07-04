import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input,Icon,Checkbox,  Row, Col, Select, TimePicker,DatePicker,Upload} from 'antd';
const Option = Select.Option;
import moment from 'moment';
import { timelyLotterySettingToServerData, timelyLotterySettingToLocalData } from '#/utils/dataProcessor';
import {FILE_UPLOAD_URL_V2, UPLOAD_TOKEN, RULE_MAP} from '#/extConstants';



@Form.create()
@connect(state => ({
  account: state.account,
}))
export default class CreateTimelySettingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList : [
      //   {
      //   uid: -1,
      //   name: 'xxx.png',
      //   status: 'done',
      //   url:   "http://172.20.2.169:9998/img/317e1c547ca99d74afb523bba49f272f/icon/dcec7dabdf586e88436cac0df3658c58b2a6a5a51499138608.png",
      //   thumbUrl:  "http://172.20.2.169:9998/img/317e1c547ca99d74afb523bba49f272f/icon/dcec7dabdf586e88436cac0df3658c58b2a6a5a51499138608.png",
      //   rel_url : "http://172.20.2.169:9998/img/317e1c547ca99d74afb523bba49f272f/icon/dcec7dabdf586e88436cac0df3658c58b2a6a5a51499138608.png",
      // }
    ]
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

    const uploadConfig = {
      name : "f",
      action : FILE_UPLOAD_URL_V2,
      listType : 'picture-card',
      data :{t : UPLOAD_TOKEN, p : 'i'},
      multiple:false,
      onChange : this.handleUpload,
      onRemove : this.handleRemovePic,
    };

    return (
      <Modal visible={overcoat.createTimelySettingModal} {...modalConfig}>
         <Form layout="horizontal">
            <Form.Item label="名字"  {...formItemLayout} >
                {getFieldDecorator('name',{rules:[{required:true,message:'请输入名字'}]})(<Input placeholder="请输入名字" />)}
            </Form.Item>
            <Form.Item label="开奖规则"  {...formItemLayout} >
                {getFieldDecorator('rule',{rules:[{required:true}], initialValue:"1"})(<Select placeholder="请选择开奖规则" >
                  {RULE_MAP.map((rule) => (<Option key={rule.key}>{rule.des}</Option>))}
                </Select>)}
            </Form.Item>
            <Form.Item  label="每期时长（秒）" {...formItemLayout} >
                {getFieldDecorator('period',{rules:[{required:true,message:'每期时间'},{validator:this.checkNumber}]})(<Input type="string" placeholder="每期时长（秒）" />)}
            </Form.Item>
            <Form.Item  label="每期间隔（秒）" {...formItemLayout} >
                {getFieldDecorator('interval',{rules:[{required:true,message:'每期间隔'},{validator:this.checkNumber}]})(<Input type="string" placeholder="每期间隔（秒）" />)}
            </Form.Item>
            <Form.Item  label="自动开奖" {...formItemLayout} >
                {getFieldDecorator('auto_open',{rules:[{required:false}]})(<Checkbox />)}
            </Form.Item>
            <Form.Item  label="自动续期" {...formItemLayout} >
                {getFieldDecorator('auto_renew',{rules:[{required:false}]})(<Checkbox />)}
            </Form.Item>
            <Form.Item label="产品图片" {...formItemLayout}>
                <Upload {...uploadConfig} fileList={this.state.fileList}>
                  <Icon type="plus" />
                  <div className="ant-upload-text">点击上传</div>
                </Upload>
                {getFieldDecorator('face_img', {rules:[{required:true, message:'请选择图片'}]})(<Input  style={{display:'none'}}/>)}
            </Form.Item>
            <Form.Item  label="生效时间" {...formItemLayout} >
                {getFieldDecorator('effect_time',{rules:[{required:true}]})(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime />)}
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

  handleUpload = info => {
    console.log("handleUpload");
    const currFile = info.file;
    if (currFile.response && currFile.response.status <= 0){
      this.props.dispatch({type:'notify/error', payload : getMsgByStatus(currFile.response.status)});
      return;
    }
    const fileList = info.fileList
    .slice(-1)
    .map(file => ({
      ...file,
      rel_url : file.response ? file.response.rel_url :file.rel_url,//相對路徑
      rel_icon : file.response ? file.response.rel_icon :file.rel_icon,//相對路徑
      url: file.response ? file.response.ab_url :file.url,
    }))
    .filter(file => file.response ? file.response.status >= 1 : true);
    //.filter(file => file.response ? file.response.key : true);
    this.setState({fileList : fileList});
    console.log(fileList[0]);
    this.props.form.setFieldsValue({face_img : fileList[0].url});
  }


  handleRemovePic = info => {
    console.debug('handleRemovePic')
    this.props.form.setFieldsValue({face_img : ''});
    this.state.fileList.splice(0, this.state.fileList.length);
    return true;
  }


  next = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;
    const { editMember } = overcoat;

    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      const formValue = form.getFieldsValue();
       console.log(formValue);

      this.props.dispatch({
        type:`timelyLottery/setting/add`,
        payload:timelyLotterySettingToServerData(formValue)
      })

      this.props.dispatch({
        type: 'overcoat/createTimelySetting_modal/close'
      });
    });
  }

  close = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;

    this.props.dispatch({
      type: 'overcoat/createTimelySetting_modal/close'
    });
  }
}
