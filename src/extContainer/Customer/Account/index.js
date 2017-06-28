import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Table, Button, Form, Input, Modal, DatePicker, Pagination,Spin} from 'antd';

import {API_ROOT_URL} from '#/extConstants';
const FormItem = Form.Item;
const confirm = Modal.confirm;



@Form.create()
@connect((state) => ({
  user:state.user,
  member:state.member,
})
)
export default class UserAccount extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      pageSize:10,
      curPage:1,
    }

  }

  componentDidMount() {
    this.loadUserAccountData();

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.member.updated) {
      this.setState({loading:false});
    }
  }

  render() {

    const {list, total} = this.props.member;
    const {user} = this.props;
    console.log(user);

    const { loading, selectedRowKeys} = this.state;

    list.map(userAccount=> {
      userAccount.key = userAccount.id;
      return userAccount;
    })

    const {getFieldDecorator} = this.props.form;

  //  const pageNumber = parseInt(total/this.state.pageSize)+((total%this.state.pageSize)==0?0:1);

    /*
    status:
    0:未处理，
    1：已开启
    */
    const columns = [
    {
      title:'用户ID',
      dataIndex:'id',
      key:"id",
      width:100
    },
    {
      title:'微信昵称',
      dataIndex:'username',
    },
    {
      title:'地区',
      dataIndex:'ipAreaInfo',
    },
    {
      title:'当日投注量',
      dataIndex:'stakeAmount',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'累计投注量',
      dataIndex:'periodStakeAmount',
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'当日排名',
      dataIndex:'rank',
      sorter:(a,b)=>{
        return a.rank - b.rank;
      },
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'阶段排名',
      dataIndex:'period_rank',
      sorter:(a,b)=>{
        return a.period_rank - b.period_rank;
      },
      render:(text, record) => (
        <span>
          {text?text:0}
        </span>
      )
    },
    {
      title:'最后登录',
      dataIndex:'last_login_time',
      render:(text, record) => (<span>{text?new Date(parseInt(text)*1000).toLocaleString():""}</span>)
    },
    {
      title:'当前余额',
      dataIndex:'balance',
      width:100,
      render:(text, record) => (
        <span style={{align:"right"}}>
        {text?text:0}{user.canModifyMoney?<a className="pull-right" href="#" onClick={this.handleEditMoney(record)}>修改</a>:null}
        </span>
      )
    },
    {
      title:'操作',
      dataIndex:'status',
      render:(text, record) => {
        if (user.canForbidUser) {
          return (record.is_enabled?<a href="#" onClick={this.handleBlock(record)}>禁用</a>:<a href="#" onClick={this.handleOpen(record)}>启动</a>
        :null)
        } else {
          return (<span></span>)
        }
      }


    }
  ];




    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <FormItem label="用户ID">
            {getFieldDecorator('userId')(<Input type="string"></Input>)}
          </FormItem>
          <FormItem label="昵称">
            {getFieldDecorator('nickname')(<Input type="string"></Input>)}
          </FormItem>
          <FormItem label="开始时间">
            {getFieldDecorator('startTime',{rules:[{type:'object'}]})(<DatePicker  format="YYYY-MM-DD"></DatePicker>)}
          </FormItem>
          <FormItem label="结束时间">
            {getFieldDecorator('endTime',{rules:[{type:'object'}]})(<DatePicker  format="YYYY-MM-DD"></DatePicker>)}
          </FormItem>
          <Button type="primary" icon="search" htmlType="submit">搜索</Button>
          <Button type="primary" icon="download" style = {{marginLeft:10}} onClick={this.handleExport}>导出</Button>
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
      this.loadUserAccountData({
        page:current - 1,
        size:pageSize,
      })
  }

  onChange = (page) => {
    this.setState({
      curPage: page,
    });

    let result = this.processSearchValues(this.props.form.getFieldsValue());

    this.loadUserAccountData({
      ...result,
      page:page - 1,
      size:this.state.pageSize,
    })
  }

  loadUserAccountData = (payload) => {
    this.setState({loading:true});
    this.props.dispatch({
      type:'member/list',
      payload:payload || {},
    });
  }

  // searchUserAccountList = (payload) => {
  //   this.props.dispatch({
  //     type:'member/userAccountList/search',
  //     payload:payload
  //   });
  // }

  handleSearch = e => {
    e.preventDefault();
    this.searchManageList(this.props.form.getFieldsValue());
    //console.log('收到表单值：', this.props.form.getFieldsValue());
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
    this.loadUserAccountData(result);

  }


  handleBlock = record => {
    return e => {
      e.preventDefault();
      let _self = this;
      confirm({
        title: '屏蔽帐号',
        content: '你确定要屏蔽选中的帐号吗？',
        onOk() {
          _self.props.dispatch({
            type: `member/forbid`,
            payload:{
              userId:record.id,
              is_enabled:0
            }
          })
        },
        onCancel() {

        },
      });
    }
  }

  handleEdit = record => {
    return e => {
      e.preventDefault();
    //  this.props.dispatch(push(`/sadmin/manage/info/${record.id}`))
    }
  }

  handleOpen = record => {
    return e => {
      e.preventDefault();
      let _self = this;
      confirm({
        title: '开启帐号',
        content: '你确定要开启选中的帐号吗？',
        onOk() {
          _self.props.dispatch({
            type: `member/forbid`,
            payload:{
              userId:record.id,
              is_enabled:1,
            }
          })
        },
        onCancel() {

        },
      });
    }
  }



  // handleDelete = e => {
  //   e.preventDefault();
  //   this.showConfirm
  //
  // }

  showDeleteConfirm = () => {
    const {selectedRowKeys} = this.state;
    let _self = this;
    confirm({
      title: '禁用帐号',
      content: '你确定要禁用选中的帐号吗？',
      onOk() {
        _self.props.dispatch({
          type: `member/forbid`,
          payload:selectedRowKeys
        });
      },
      onCancel() {

      },
    });
  }

  handleExport = e => {
      e.preventDefault();
      const startTime = this.props.form.getFieldsValue().startTime;
      const endTime = this.props.form.getFieldsValue().endTime;
      console.log(startTime);
      if (startTime && endTime) {
        let url = API_ROOT_URL+`/user/member/download/?token=${this.props.user.getToken()}&startTime=${parseInt(startTime._d.getTime()/1000)}&endTime=${parseInt(endTime._d.getTime()/1000)}`;
        console.log(url);
        window.open(url);
      }


  }

  handleEditMoney = (record)=>{

    return e=>{
      e.preventDefault();
      console.log("rasdf", record.id);
      this.props.dispatch({
        type:'overcoat/editBalance_modal/show',
        payload:{editMember:record},
      })
    }
    //TODO handle edit money


  }


  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

}
