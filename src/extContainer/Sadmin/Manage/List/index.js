import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Table, Button, Form, Input, Modal} from 'antd';
const FormItem = Form.Item;
const confirm = Modal.confirm;



@Form.create()
@connect((state) => ({
  samanage: state.samanage
})
)
export default class AdminAccount extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      accountList:[],
      loading:false,
      selectedRowKeys:[]
    }

  }

  componentDidMount() {
    this.loadManageData();

  }

  componentWillReceiveProps(nextProps) {
    const {samanage} = nextProps;
    let {closeSelected} = samanage;
    if (closeSelected && closeSelected.length>0) {
      this.setState({selectedRowKeys:[]});
    };
  }

  render() {

    /*
    status:
    0:未处理，
    1：已开启
    */
    const columns = [
    {
      title:'ID',
      dataIndex:'id',
      key:'id',
      width:100
    },
    {
      title:'账户名称',
      dataIndex:'userName',
    },
    {
      title:'禁用账户',
      dataIndex:'canForbidUser',
      render:(text, record) => (<span>{text?"是":"否"}</span>)
    },
    {
      title:'修改余额',
      dataIndex:'canModifyBalance',
      render:(text, record) => (<span>{text?"是":"否"}</span>)
    },
    {
      title:'操作',
      dataIndex:'status',
      render:(text, record) => (
        <span>
          <a href="#" onClick={this.handleBlock(record)}>禁用</a>
          <span className="ant-divider"></span>
          <a href="#" onClick={this.handleEdit(record)}>修改</a>
        </span>
      )
    }
  ];



    const { loading, selectedRowKeys} = this.state;

    let {accountList} = this.props.samanage;
    accountList.map(account=> {
      account.key = account.id;
      return account;
    })
    console.log(accountList);

    const hasSelected = selectedRowKeys.length > 0;

    const {getFieldProps} = this.props.form;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.status == 0,    // Column configuration not to be checked
      }),
    };

    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <FormItem label="账号">
             <Input {...getFieldProps('username')}/>
          </FormItem>
          <Button type="primary" icon="search" htmlType="submit">搜索</Button>
        </Form>
        <div>
          <div style={{marginBottom:20, marginTop:40}}>
          <Button type="primary" size="large" onClick={this.handleCreate} style={{marginRight:20}}>创建新账户</Button>
          <Button type="primary" size="large" onClick={this.showDeleteConfirm} disabled={!hasSelected} loading={loading}>禁用账户</Button>
           <span style={{ marginLeft: 8 }}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个账户` : ''}</span>
          </div>
          <Table rowSelection={rowSelection} columns={columns} dataSource={accountList}/>
        </div>
      </div>
    )
  }

  loadManageData = () => {
    this.props.dispatch({
      type:'samanage/list'
    });
  }

  searchManageList = (payload) => {
    this.props.dispatch({
      type:'samanage/list/search',
      payload:payload
    });
  }

  handleSearch = e => {
    e.preventDefault();
    this.searchManageList(this.props.form.getFieldsValue());
    //console.log('收到表单值：', this.props.form.getFieldsValue());
  }


  handleBlock = record => {
    return e => {
      e.preventDefault();
      this.showDeleteConfirm();
    //  this.props.dispatch(push(`/sadmin/manage/info/${record.id}`))
    }
  }

  handleEdit = record => {
    return e => {
      e.preventDefault();
      this.props.dispatch({
          type:`sadmin/manage/editAccount_modal/show`,
          payload:{editAccount:record}
      });
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
            type: `samanage/open`,
            payload:record
          })
        },
        onCancel() {

        },
      });
    }
  }

  handleClose = record => {
    return e=> {
      e.preventDefault();
      let _self = this;
      confirm({
        title: '禁用帐号',
        content: '你确定要禁用选中的帐号吗？',
        onOk() {
          _self.props.dispatch({
            type: `samanage/close`,
            payload:record
          })
        },
        onCancel() {

        },
      });

    }
  }


  handleCreate = e => {
      e.preventDefault();
      this.props.dispatch({
          type:`sadmin/manage/createAccount_modal/show`,
      });
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
          type: `samanage/closeSelected`,
          payload:selectedRowKeys
        });
      },
      onCancel() {

      },
    });
  }


  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }





}
