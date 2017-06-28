import React from 'react';
import './styles.scss';

export default class Wrapper extends React.PureComponent {
  static propTypes = {
    title: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const isProd = process.env.NODE_ENV === 'production';
    return (
      <div className='account'>
        <div className='heading'>
          <p className='title'>直播超级管理员系统</p>
          <p className='desc'>{!isProd && 'Broadcast'}</p>
        </div>
        <div className='content'>
          <div className='title'>{this.props.title}</div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
