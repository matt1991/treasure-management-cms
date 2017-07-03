import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Table, Button, Form, Input, Modal, DatePicker, Pagination,Spin, Select, Row} from 'antd';

import {processOrderSearchForm} from '#/utils/dataProcessor'

import {API_ROOT_URL} from '#/extConstants';
const FormItem = Form.Item;
const Option = Select.Option;



@Form.create()
@connect((state) => ({
  user:state.user,
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

    return (
      <div>
          <Form layout="horizontal">

         </Form>
      </div>
    )
  }

  loadData = (payload) => {

  }

}
