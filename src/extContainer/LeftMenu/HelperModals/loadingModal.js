import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, Spin, Form} from 'antd';

@Form.create()
@connect(state => ({
  overcoat : state.overcoat,
}))
export default class LoadingModal extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log("componentDidMount");
    const {overcoat} = this.props;
    const {loadingPercent} = overcoat;
    console.log("dispatch");
    this.props.dispatch({type:"overcoat/start/loading", payload:{loadingPercent}});
  }

  componentWillReceiveProps(nextProps){
    console.log("componentWillReceiveProps");
    const {overcoat} = this.props;
    const {loadingPercent} = overcoat;
    console.log("dispatch");
    this.props.dispatch({type:"overcoat/start/loading", payload:{loadingPercent}});
  }

  render() {
    const {overcoat} = this.props;
    const {loadingPercent} = overcoat;
    const modalConfig = this.getModalConfig();

    return (
      <div visible={overcoat.editBalanceModal} style={{position:"fixed", overflow:"auto", top:0,bottom:0,left:0,right:0, backgroundColor:"rgba(0, 0, 0, 0.66)", zIndex:1000, display:loadingPercent>99?"none":"block"}}>
        <div style={{position:"relative",margin:"auto", width:200}}>
            <Spin size="large" />
        </div>
      </div>
    );
  }



  getModalConfig = () => {
    return {
      footer:null,
      width: 600,
      closable:false,
      maskClosable: false,
    };
  }

  close = e => {
    e.stopPropagation();
    this.props.dispatch({
      type:'overcoat/create_notify_modal/show/failed'
    })
  }

  validateDelay =  (rule, value, callback) => {
    const method = this.props.form.getFieldValue('method');
    console.log("validateDelay", parseInt(value));
    if (method == "1" && !value) {
      callback(new Error('请输入上线时间'));
    } else if (method == "1" && parseInt(value) < 0) {
      callback(new Error('请输入正确上线时间'));
    } else {
      callback();
    }
    // if (value && !this.validate('email', value)) {
    //   callback(new Error('邮箱格式不正确'));
    // } else {
    //   callback();
    // }
  }

  // this.props.form.validateFields((errors, values) => {
  //     if (errors) {
  //       console.log(errors);
  //     }
  //     console.log(values);
  //   });

  next =e => {
    e.stopPropagation();
    this.props.form.validateFields((errors, values) => {
      console.log("validateFields1", errors);
      console.log("validateFields2", values);
      if (errors) {
        console.log(errors);
      } else {
        console.log(values);
        console.log(this.state.effectTime);
        let formData = values;
        if (this.state.immediate) {
          formData.delay = 0;
          formData.dtime = 0;
        } else {
          let dtime = []
          this.state.effectTime.map((effect) => {
            let weekday = values.dtime[`weekday.${effect.key}`];
            let begin = values.dtime[`begin.${effect.key}`];
            let end = values.dtime[`end.${effect.key}`];
            console.log(weekday, begin, end);
            if (weekday && begin && end && begin.getTime() < end.getTime()) {
              let time = {
                weekday:parseInt(weekday),
                begin:("0" + begin.getHours()).slice(-2) + ":" + ("0" + begin.getMinutes()).slice(-2),
                end:("0" + end.getHours()).slice(-2) + ":" + ("0" + end.getMinutes()).slice(-2),
              }
              dtime.push(time);
            }

          });
          formData.dtime = dtime;
        }
        formData.atime = parseInt(formData.atime.getTime()/1000);
        formData.etime = parseInt(formData.etime.getTime()/1000);
        if (formData.rid) {
          const {roomList} = this.props.notify;
          formData.name = roomList[formData.rid];
        }
        this.props.dispatch({
          type:"notify/create",
          payload:formData
        })
      }
    })
  }

  addPushTime = (item) => {
     let effectTime = this.state.effectTime;
     if (effectTime.length > 4) {
       return;
     } else {
       let lastOne = effectTime[effectTime.length-1];
       lastOne.isLast = false;
       let key = Date.now();
       let time = {
         key:key,
         isLast:true
       }
       effectTime.push(time);


       this.setState({effectTime});
     }

  }

  removePushTime = (item) => {
    let effectTime = this.state.effectTime;
    if (effectTime.length < 2) {
      return;
    } else {
      let index = effectTime.indexOf(item);
      effectTime.splice(index, 1);
      if (item.isLast) {
        effectTime[effectTime.length - 1].isLast = true;
      }
      this.setState({effectTime});
    }
  }

  methodChange = (value) => {
      if (value == "1") {
        this.setState({immediate:false});
      } else {
        this.setState({immediate:true});
        this.props.form.setFieldsValue({delay:"0"});
      }
  }
}
