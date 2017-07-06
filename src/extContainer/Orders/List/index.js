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
      dataIndex:'lottery.name',
    },
    {
      title:'配置号',
      dataIndex:'lottery.setting.id'
    },
    {
      title:'期数',
      dataIndex:'lottery.number',
    },
    {
      title:'开始时间',
      dataIndex:'lottery.start_time',
      render:(text, record) => (<span>{text?new Date(parseInt(text)).toLocaleString():""}</span>)
    },
    {
      title:'开奖时间',
      dataIndex:'lottery.lucky_time',
      render:(text, record) => (<span>{text?new Date(parseInt(text)).toLocaleString():""}</span>)
    },
    {
      title:'投注时间',
      dataIndex:'time',
      render:(text, record) => (<span>{text?new Date(parseInt(text)).toLocaleString():""}</span>)
    },
    {
      title:'投注人',
      dataIndex:'user.username',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'产品类型',
      dataIndex:'lottery.type',
      render:(text, record) => {
        let result;
        if (text == 0) {
          result = "每周一注";
        } else if (text == 1) {
          result = "时时夺宝";
        } else if (text == 2) {
          result = "人满即开";
        } else {
          result = "";
        }

        return (<span>{result}</span>)
      }
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
      title:'投注金额',
      dataIndex:'amount',
      render:(text, record) => (
        <span>
          {record.amount * record.unit_price}
        </span>
      )
    },
    {
      title:'状态',
      dataIndex:'state',
      render:(text, record) => {
        let result;
        if (record.lottery.state == 1 || record.lottery.state == 2 ) {
          result = "未开奖";
        } else if (record.lottery.state == 3 || record.is_lucky == 0 ) {
          result = "未中奖";
        } else if (record.is_lucky == 1) {
          result = "已中奖"
        } else {
          result = "";
        }

        return (<span>{result}</span>)
      }
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
            {getFieldDecorator('uid')(<Input type="string"></Input>)}
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
          {(total>0 && !this.state.loading)?<Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} pageSizeOptions={['10','20','30']} onChange={this.onChange} defaultCurrent={this.state.curPage} defaultPageSize={this.state.pageSize} total={total} />:null}
        </div>
      </div>
    )
  }

  onShowSizeChange = (current, pageSize)=>{
    console.log(current, pageSize);
      this.setState({curPage:current,pageSize:pageSize});
      let result = processOrderSearchForm(this.props.form.getFieldsValue());

      this.loadData({
        ...result,
        curPage:current,
        pageSize:pageSize,
      })
  }

  onChange = (page) => {
    this.setState({
      curPage: page,
    });

    let result = processOrderSearchForm(this.props.form.getFieldsValue());

    this.loadData({
      ...result,
      curPage:page,
      pageSize:this.state.pageSize,
    })
  }

  loadData = (payload) => {
    this.setState({loading:true});

      this.props.dispatch({
        type:'order/list',
        payload:payload || {},
      });
  }

  handleSearch = e => {
    e.preventDefault();
    this.setState({
      curPage:1,
    })
    let searchForm = processOrderSearchForm(this.props.form.getFieldsValue());
    console.log(searchForm);
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
