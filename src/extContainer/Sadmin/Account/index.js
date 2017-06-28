import React from 'react';
import {connect} from 'react-redux';
import {push, replace} from 'redux-router';
import {Button} from 'antd';
import styles from './styles.scss';



const Field = ({field}) => {
  return (
    <span className={styles.Field}>
      <span className="key">{field}</span>
      <span>：</span>
    </span>
  )
}
@connect(state => ({
  sauser:state.sauser
}))
export default class Account extends React.Component {
  constructor(props) {
    super(props);
  }


  componentDidMount() {
  //  this.loadAccountData();
  }


  render() {
    const {sauser} = this.props;
    return (
      <div>
        <div>
          <Field field="帐号"/>
          <span>{sauser.account}</span>
        </div>
        <div>
          <Field field="密码"/>
          <span>********</span>
          <Button type="primary" style={{marginLeft:20}} onClick={this.handlechangepwd}>修改</Button>
        </div>
      </div>
    )
  }

  handlechangepwd = e => {
    e.preventDefault();

    this.props.dispatch({
      type: 'sadmin/changepwd_modal/show'
    });
  }
}
