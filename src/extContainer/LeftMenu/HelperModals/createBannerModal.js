import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input,Icon,Checkbox,  Row, Col, Select, TimePicker,DatePicker, Upload} from 'antd';
const Option = Select.Option;
import moment from 'moment';
import {FILE_UPLOAD_URL_V2, LOCATION_MAP, DEVICE_MAP} from '#/extConstants';

import { bannerToServerData, bannerToLocalData } from '#/utils/dataProcessor';


@Form.create()
@connect(state => ({
  account: state.account,
  banner:state.banner
}))
export default class CreateBannerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList:[]
    }
  }

  render() {
    const { overcoat, form,banner } = this.props;

    const modalConfig = this.getModalConfig();

    const uploadConfig = {
      name : "f",
      action : FILE_UPLOAD_URL_V2,
      listType : 'picture-card',
      data :{u : this.props.user.getAccount(), t : this.props.user.getToken(), p : 'i'},
      multiple:false,
      onChange : this.handleUpload,
      onRemove : this.handleRemovePic,
    };


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
      <Modal visible={overcoat.createBannerModal} {...modalConfig}>
         <Form layout="horizontal">
            <Form.Item label="位置"  {...formItemLayout} >
                {getFieldDecorator('location',{rules:[{required:true,message:'请选择位置'}]})(<Select placeholder="请选择位置" >
                  {LOCATION_MAP.map((location) => (<Option key={location.key}>{location.des}</Option>))}
                </Select>)}
            </Form.Item>
            <Form.Item label="设备"  {...formItemLayout} >
                {getFieldDecorator('device',{rules:[{required:true, message:"请选择设备"}]})(<Select placeholder="请选择设备" >
                  {DEVICE_MAP.map((device) => (<Option key={device.key}>{device.des}</Option>))}
                </Select>)}
            </Form.Item>
            <Form.Item  label="次序" {...formItemLayout} >
                {getFieldDecorator('index',{rules:[{required:true,message:'请输入次序'},{validator:this.checkNumber}]})(<Input type="string" placeholder="请输入次序" />)}
            </Form.Item>
            <Form.Item label="图片" {...formItemLayout}>
                {getFieldDecorator('img_url', {rules:[{required:true, message:'请选择图片'}]})(<Upload {...uploadConfig} fileList={this.state.fileList}>
                  <Icon type="plus" />
                  <div className="ant-upload-text">点击上传</div>
                </Upload>)}
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
      title: "新增banner",
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


  handleUpload = info => {
    // retain the last uploaded one
    // replace url
    // filter those which don't have correct response
    //console.log(info,'###########');
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
    this.props.form.setFieldsValue({img_url : fileList[0].rel_icon});
  }


  handleRemovePic = info => {
    console.debug('handleRemovePic')
    this.props.form.setFieldsValue({img_url : ''});
    this.state.fileList.splice(0, this.state.fileList.length);
    return true;
  }





  next = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;

    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      const formValue = form.getFieldsValue();
      this.props.dispatch({
        type:`banner/add`,
        payload:bannerToServerData(formValue)
      })

      this.props.dispatch({
        type: 'overcoat/createBanner_modal/close'
      });
    });
  }

  close = e => {
    e.stopPropagation();
    const { overcoat, form } = this.props;

    this.props.dispatch({
      type: 'overcoat/createBanner_modal/close'
    });
  }
}
