import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form , Input } from 'antd';
import styles from '../styles.scss';

@Form.create()
@connect(state => ({
  account: state.account,
}))
export default class ViewImageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { overcoat, form } = this.props;

    return (
      <Modal visible={overcoat.viewImageModal} title="图片" onCancel={this.closeModal} footer={null}>
          <img className="image-modal" src={overcoat.images} alt='封面图片'/>
      </Modal>
    );
  }


  closeModal = (e) => {
    e.preventDefault();

    this.props.dispatch({
      type:'sadmin/room/viewImage_modal/show/failed'
    })
  }

}
