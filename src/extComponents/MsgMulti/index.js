import React from 'react';
/*
 * this component is for validate error msg show
 * http://ant.design/components/notification
 * message 通知提醒标题，必选 React.Element or String
 */
const MsgMulti = React.createClass({
  render() {
    return (
      <div>
        {
          this.props.msg.map((n, index) => <div key={index}>{n}</div>)
        }
      </div>
    );
  }
});

export default MsgMulti;
