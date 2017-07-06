import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Table, Button, Form, Input, Modal, DatePicker, Pagination,Spin, Select, Row} from 'antd';

import {API_ROOT_URL, RULE_MAP} from '#/extConstants';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;



@Form.create()
@connect((state) => ({
  user:state.user,
  accumulatedLottery:state.accumulatedLottery
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

    const {settingList, total} = this.props.accumulatedLottery;
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
      title:'累计天数',
      dataIndex:'period',
      render:(text, record) => (<span>{parseInt(text) / (24* 60 * 60 * 1000)}</span>)
    },
    {
      title:'开奖规则',
      dataIndex:'rule',
      render:(text, record) => {
        let result = "";
        RULE_MAP.map((rule) => {
          if (text === rule.key) {
            result = rule.des
          }
        });
        return (<span>{result}</span>)
      }
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
      title:'创建时间',
      dataIndex:'create_time',
      render:(text, record) => (<span>{(new Date(text)).toLocaleString("zh-CN",{hour12:false})}</span>)
    },
    {
      title:'修改时间',
      dataIndex:'modify_time',
      render:(text, record) => (<span>{(new Date(text)).toLocaleString("zh-CN",{hour12:false})}</span>)
    },
    {
      title:'操作',
      dataIndex:'status',
      render:(text, record) => {
          return (<span><a href="#" onClick={this.open(record)}>开奖</a> | <a href="#" onClick={this.renew(record)}>续期</a> | <a href="#" onClick={this.handleEdit(record)}>编辑</a></span>)
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
    this.props.dispatch({
      type:'accumulatedLottery/setting/list',
      payload:payload || {},
    });
  }

  handleSearch = e => {
    e.preventDefault();
    this.searchManageList(this.props.form.getFieldsValue());
    //console.log('收到表单值：', this.props.form.getFieldsValue());
  }

  createSetting = e => {
    e.preventDefault();
    this.props.dispatch({
      type:"overcoat/createAccumulatedSetting_modal/show"
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
        type:`/accumulatedLottery/settings/open`,
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
        type:`/accumulatedLottery/settings/renew`,
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
        type:`overcoat/editAccumulatedSetting_modal/show`,
        payload:{
          editAccumulatedSetting:record
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
