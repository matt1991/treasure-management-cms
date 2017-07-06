import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Table, Button, Form, Input, Modal, DatePicker, Pagination,Spin, Select, Row} from 'antd';
import {processLotterySearchForm} from '#/utils/dataProcessor'

import {API_ROOT_URL} from '#/extConstants';
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
export default class List extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      pageSize:10,
      curPage:1,
    }

  }

  componentDidMount() {
    this.loadData();

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accumulatedLottery.updated) {
      this.setState({loading:false});
    }
  }

  render() {

    const {list, total} = this.props.accumulatedLottery;

    const {user} = this.props;

    const { loading, selectedRowKeys} = this.state;

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
      key:'name',
    },
    {
      title:'期数',
      dataIndex:'number',
      key:'number',
    },
    {
      title:'开始时间',
      dataIndex:'start_time',
      key:'start_time',
      render:(text, record) => (<span>{text?new Date(parseInt(text)).toLocaleString():""}</span>)
    },
    {
      title:'截止时间',
      dataIndex:'end_time',
      key:'end_time',
      render:(text, record) => (<span>{text?new Date(parseInt(text)).toLocaleString():""}</span>)
    },
    {
      title:'当前奖池',
      dataIndex:'lucky_pool',
      key:'lucky_pool',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'状态',
      dataIndex:'state',
      key:'state',
      render:(text, record) => {
        let result = "";
        switch (text) {
          case 0:
            result = "未开始";
            break;
          case 1:
            result = "投注中";
            break;
          case 2:
            result = "待开奖";
            break;
          case 3:
            result = "已开奖";
            break
          default:
            result = "未知错误";
            break;

        };
        return (<span>{result}</span>)
      }
    },
    {
      title:'中奖号码',
      dataIndex:'lucky_number',
      key:'lucky_number',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'操作',
      dataIndex:'status',
      key:'status',
      render:(text, record) => {
          return (<a href="#" onClick={this.handleBlock(record)}>查看</a>)
        }
    }
  ];



    return (
      <div>
      <Form className="ant-advanced-search-form" layout="inline" style={{marginTop:10}} onSubmit={this.handleSearch}>
          <FormItem label="ID">
            {getFieldDecorator('id')(<Input type="string"></Input>)}
          </FormItem>
          <FormItem label="名字">
            {getFieldDecorator('name')(<Input type="string"></Input>)}
          </FormItem>
          <FormItem label="开始时间">
            {getFieldDecorator('start_time', {rules:[{type:'array'}]})(
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            )}
          </FormItem>

        <FormItem label="期数">
          {getFieldDecorator('number')(<Input type="string"></Input>)}
        </FormItem>
        <FormItem label="状态">
        {getFieldDecorator('state')(<Select >
          <Option value="1">全部</Option>
          <Option value="2">未开始</Option>
          <Option value="3">投注中</Option>
          <Option value="4">待开奖</Option>
          <Option value="5">已开奖</Option>
        </Select>)}
        </FormItem>
        <FormItem label="开奖时间">
          {getFieldDecorator('lucky_time', {rules:[{type:'array'}]})(
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>
        <Button type="primary" icon="search" htmlType="submit">搜索</Button>
      </Form>

        {this.state.loading?<div style={{position:"fixed", overflow:"auto", top:0,bottom:0,left:0,right:0, backgroundColor:"rgba(0, 0, 0, 0.66)", zIndex:1000}}>
            <Spin style={{position:"absolute",top:"50%", left:"50%"}} size="large"/>
        </div>:<div style={{marginTop:20}}>
          <Table {...{pagination:false}} columns={columns} dataSource={list}/>
        </div>}

        <div className="pull-right" style={{marginTop:20}}>
          {(total>0 && !this.state.loading)?<Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onChange} defaultCurrent={this.state.curPage} defaultPageSize={this.state.pageSize} total={total} />:null}
        </div>
      </div>
    )
  }

  onShowSizeChange = (current, pageSize)=>{
      this.setState({curPage:current,pageSize:pageSize});
      let result = processLotterySearchForm(this.props.form.getFieldsValue());

      this.loadData({
        ...result,
        curPage:current,
        pageSize:pageSize,
      })
  }

  handleBlock = record => {
    return e=>{
      return;
    }
  }

  onChange = (page) => {
    this.setState({
      curPage: page,
    });

    let result = processLotterySearchForm(this.props.form.getFieldsValue());

    this.loadData({
      ...result,
      curPage:page,
      pageSize:this.state.pageSize,
    })
  }

  loadData = (payload) => {
    this.setState({loading:true});

    if ( payload && payload.id) {
      this.props.dispatch({
        type:'accumulatedLottery/id/search',
        payload
      })
    } else {
      this.props.dispatch({
        type:'accumulatedLottery/list',
        payload:payload || {},
      });
    }
  }



  handleSearch = e => {
    e.preventDefault();
    this.setState({
      curPage:1,
    })
    let searchForm = processLotterySearchForm(this.props.form.getFieldsValue());
    this.loadData({
      ...searchForm,
      curPage: 1,
      pageSize:this.state.pageSize,
    })

  }


  handleEdit = record => {
    return e => {
      e.preventDefault();
    //  this.props.dispatch(push(`/sadmin/manage/info/${record.id}`))
    }
  }




  // handleDelete = e => {
  //   e.preventDefault();
  //   this.showConfirm
  //
  // }
}
