import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Table, Button, Form, Input, Modal, DatePicker, Pagination,Spin, Select, Row} from 'antd';

import {API_ROOT_URL} from '#/extConstants';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;



@Form.create()
@connect((state) => ({
  user:state.user,
  fullLottery:state.fullLottery
})
)
export default class Settings extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pageSize:10,
      curPage:1,
    }

  }

  componentDidMount() {
    this.loadData();

  }

  componentWillReceiveProps(nextProps) {
  }

  render() {

    const {settingList, total} = this.props.fullLottery;
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
      title:'夺宝名称',
      dataIndex:'name',
    },
    {
      title:'创建时间',
      dataIndex:'create_time',
      render:(text, record) => (<span>{text?text:""}</span>)
    },
    {
      title:'间隔',
      dataIndex:'interval',
      render:(text, record) => (<span>{text?text:""}</span>)
    },
    {
      title:'开奖规则',
      dataIndex:'rule',
      render:(text, record) => (<span>{text?text:""}</span>)
    },
    {
      title:'截止时间',
      dataIndex:'end_time',
      render:(text, record) => (<span>{text?text:""}</span>)
    },
    {
      title:'期数',
      dataIndex:'number',
    },
    {
      title:'自动开奖',
      dataIndex:'auto_open',
    },
    {
      title:'自动续期',
      dataIndex:'auto_renew',
    },

    {
      title:'状态',
      dataIndex:'state',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'操作',
      dataIndex:'status',
      render:(text, record) => {
          return (<span><a href="#" onClick={this.open(record)}>开奖</a><a href="#" onClick={this.renew(record)}>续期</a><a href="#" onClick={this.editSetting(record)}>编辑</a></span>)
        }
    }
  ];



    return (
      <div>
        <Button type="primary" onClick={this.createSetting}>新增</Button>
        <div style={{marginTop:20}}>
          <Table {...{pagination:false}} columns={columns} dataSource={settingList}/>
        </div>

      </div>
    )
  }

  onShowSizeChange = (current, pageSize)=>{
      this.setState({curPage:current,pageSize:pageSize});
      this.loadData({
        page:current - 1,
        size:pageSize,
      })
  }

  onChange = (page) => {
    this.setState({
      curPage: page,
    });

    let result = this.processSearchValues(this.props.form.getFieldsValue());

    this.loadData({
      ...result,
      page:page - 1,
      size:this.state.pageSize,
    })
  }

  loadData = (payload) => {
    // this.setState({loading:true});
    // this.props.dispatch({
    //   type:'fullLottery/list',
    //   payload:payload || {},
    // });
  }

  handleSearch = e => {
    e.preventDefault();
    this.searchManageList(this.props.form.getFieldsValue());
    //console.log('收到表单值：', this.props.form.getFieldsValue());
  }

  createSetting = e => {
    e.preventDefault();
    this.props.dispatch({
      type:"overcoat/createFullSetting_modal/show"
    })
    return;
  }


  processSearchValues = (values) => {
    let result = {
      userId:values.userId,
      nickname:values.nickname,
    }
    if (values.startTime) {
      result.startTime = parseInt(values.startTime._d.getTime()/1000);
    }
    if (values.endTime) {
      result.endTime = parseInt(values.endTime._d.getTime()/1000);
    }

    if (result.startTime && result.endTime && result.endTime < result.startTime) {
      return undefined;
    }

    return result;

  }

  searchManageList = (values) => {
    let result = this.processSearchValues(values);
    console.log(result);
    if (!result) {
      return;
    }
    this.loadData(result);

  }


  open = record => {
    return e => {
      e.preventDefault();
      console.log("open");
      this.props.dispatch({
        type:`/fullLottery/settings/open`,
        payload:{
          setting_id:1,
          lottery_id:1,
        }
      })
    //  this.props.dispatch(push(`/sadmin/manage/info/${record.id}`))
    }
  }

  renew = record => {
    return e => {
      e.preventDefault();
      console.log("renew");
      this.props.dispatch({
        type:`/fullLottery/settings/renew`,
        payload:{
          setting_id:1,
          lottery_id:1,
        }
      })
    //  this.props.dispatch(push(`/sadmin/manage/info/${record.id}`))
    }
  }



  handleEdit = record => {
    return e => {
      e.preventDefault();
      this.props.dispatch({
        type:`overcoat/editFullSetting_modal/show`,
        payload:{
          editFullSetting:record
        }
      })
    //  this.props.dispatch(push(`/sadmin/manage/info/${record.id}`))
    }
  }




  // handleDelete = e => {
  //   e.preventDefault();
  //   this.showConfirm
  //
  // }
}
