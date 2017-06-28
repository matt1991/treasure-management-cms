import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Table, Button, Form, Input, Modal, DatePicker, Pagination,Spin, Select, Row} from 'antd';

import {processOrderSearchForm} from '#/utils/dataProcessor'

import {API_ROOT_URL} from '#/extConstants';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;



@Form.create()
@connect((state) => ({
  user:state.user,
  order:state.order
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
    if (nextProps.order.updated) {
      this.setState({loading:false});
    }
  }

  render() {

    const {list, total} = this.props.order;
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
    },
    {
      title:'期数',
      dataIndex:'number',
    },
    {
      title:'开始时间',
      dataIndex:'start_time',
      render:(text, record) => (<span>{text?new Date(parseInt(text)).toLocaleString():""}</span>)
    },
    {
      title:'开奖时间',
      dataIndex:'lucky_time',
      render:(text, record) => (<span>{text?new Date(parseInt(text)).toLocaleString():""}</span>)
    },
    {
      title:'投注时间',
      dataIndex:'create_time',
      render:(text, record) => (<span>{text?new Date(parseInt(text)).toLocaleString():""}</span>)
    },
    {
      title:'投注人',
      dataIndex:'login_name',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'产品类型',
      dataIndex:'lottery_type',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'运营商',
      dataIndex:'pid',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'投注人次',
      dataIndex:'current_amount',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
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
      title:'中奖号码',
      dataIndex:'lucky_number',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'是否中奖',
      dataIndex:'is_lucky',
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
          return (<a href="#" onClick={this.checkNumber(record)}>投注数字</a>)
        }
    }
  ];



    return (
      <div>
      <Form className="ant-advanced-search-form" layout="inline" style={{marginTop:10}} onSubmit={this.handleSearch}>
        <Row>
          <FormItem label="投注单号">
            {getFieldDecorator('id')(<Input type="string"></Input>)}
          </FormItem>
          <FormItem label="配置号">
            {getFieldDecorator('setting_id')(<Input type="string"></Input>)}
          </FormItem>
          <FormItem label="投注时间">
            {getFieldDecorator('start_time', {rules:[{type:'array'}]})(
              <RangePicker />
            )}
          </FormItem>
          <FormItem label="期数">
            {getFieldDecorator('number')(<Input type="string"></Input>)}
          </FormItem>
          <FormItem label="运营商">
            {getFieldDecorator('pid')(<Input type="string"></Input>)}
          </FormItem>
          <FormItem label="产品类型">
            {getFieldDecorator('type')(<Input type="string"></Input>)}
          </FormItem>
          <FormItem label="投注人">
            {getFieldDecorator('login_name')(<Input type="string"></Input>)}
          </FormItem>

        </Row>
        <FormItem label="状态">
        {getFieldDecorator('state')(<Select >
          <Option value="1">全部</Option>
          <Option value="2">未开始</Option>
          <Option value="3">投注中</Option>
          <Option value="4">待开奖</Option>
          <Option value="5">已开奖</Option>
        </Select>)}
        </FormItem>
        <FormItem label="中奖时间">
          {getFieldDecorator('lucky_time', {rules:[{type:'array'}]})(
            <RangePicker />
          )}
        </FormItem>
        <Button type="primary" icon="search" htmlType="submit">搜索</Button>
      </Form>

        {this.state.loading?<div style={{position:"fixed", overflow:"auto", top:0,bottom:0,left:0,right:0, backgroundColor:"rgba(0, 0, 0, 0.66)", zIndex:1000}}>
            <Spin style={{position:"absolute",top:"50%", left:"50%"}} size="large"/>
        </div>:<div style={{marginTop:20}}>
          <Table {...{pagination:false}} columns={columns} dataSource={list}/>
        </div>}
        {/*<div style={{marginTop:20}}>
          <Table {...{pagination:false}} columns={columns} dataSource={list}/>
        </div>*/}

        <div className="pull-right" style={{marginTop:20}}>
          {(total>0 && !this.state.loading)?<Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onChange} defaultCurrent={this.state.curPage} defaultPageSize={this.state.pageSize} total={total} />:null}
        </div>
      </div>
    )
  }

  onShowSizeChange = (current, pageSize)=>{
      this.setState({curPage:current,pageSize:pageSize});
      let result = processOrderSearchForm(this.props.form.getFieldsValue());

      this.loadData({
        ...result,
        curPage:page - 1,
        pageSize:this.state.pageSize,
      })
  }

  onChange = (page) => {
    this.setState({
      curPage: page,
    });

    let result = processOrderSearchForm(this.props.form.getFieldsValue());

    this.loadData({
      ...result,
      curPage:page - 1,
      pageSize:this.state.pageSize,
    })
  }

  loadData = (payload) => {
    this.setState({loading:true});

    if ( payload && payload.id) {
      this.props.dispatch({
        type:'order/id/search',
        payload
      })
    } else {
      this.props.dispatch({
        type:'order/list',
        payload:payload || {},
      });
    }
  }

  handleSearch = e => {
    e.preventDefault();
    this.setState({
      curPage:1,
    })
    let searchForm = processOrderSearchForm(this.props.form.getFieldsValue());
    this.loadData({
      ...searchForm,
      curPage: 1,
      pageSize:this.state.pageSize,
    })

  }





  checkNumber = record => {
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
