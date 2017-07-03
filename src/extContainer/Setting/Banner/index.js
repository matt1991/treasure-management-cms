import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Table, Button, Form, Input, Modal, DatePicker, Pagination,Spin, Select, Row} from 'antd';

import {processOrderSearchForm} from '#/utils/dataProcessor'

import {LOCATION_MAP, DEVICE_MAP} from '#/extConstants';
const FormItem = Form.Item;
const Option = Select.Option;



@Form.create()
@connect((state) => ({
  user:state.user,
  banner:state.banner
})
)
export default class Banner extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  componentDidMount() {
    this.loadData();

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {

    const {list, total} = this.props.banner;
    const {user} = this.props;

    const { selectedRowKeys} = this.state;

    const {getFieldDecorator} = this.props.form;


    const columns = [
    {
      title:'ID',
      dataIndex:'id',
      key:"id",
      width:100
    },
    {
      title:'位置',
      dataIndex:'location',
      render:(text, record) => {
        let result;
        LOCATION_MAP.map((location) => {
          if (location.key === text) {
            result = location.des;
          }
        })
        return (<span>{result}</span>)
      }
    },
    {
      title:'设备',
      dataIndex:'device',
      render:(text, record) => {
        let result;
        DEVICE_MAP.map((device) => {
          if (device.key === text) {
            result = device.des;
          }
        })
        return (<span>{result}</span>)
      }
    },
    {
      title:'图片',
      dataIndex:'img_url',
      render:(text, record) => (<img src={text} style={{width:100, height:100}}/>)
    },
    {
      title:'操作',
      dataIndex:'status',
      render:(text, record) => {
          return (<span><a href="#" onClick={this.handleEdit(record)}>编辑</a></span>)
        }
    }
  ];



    return (
      <div>
        <Button type="primary" onClick={this.handleCreate}>新增</Button>
        <div style={{marginTop:20}}>
          <Table {...{pagination:false}} columns={columns} dataSource={list}/>
        </div>

      </div>
    )
  }

  loadData = (payload) => {
    this.props.dispatch({
      type:'banner/list',
      payload:payload || {},
    });
  }

  handleCreate = e => {
    e.preventDefault();
    this.props.dispatch({
      type:"overcoat/createBanner_modal/show"
    })
    return;
  }

  handleEdit = record => {
    return e => {
      e.preventDefault();
      this.props.dispatch({
        type:`overcoat/editBanner_modal/show`,
        payload:{
          editBanner:record
        }
      })
    }
  }

}
