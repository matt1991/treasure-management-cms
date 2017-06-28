import React from 'react';

import CreateAccumulatedSettingModal from './createAccumulatedSettingModal';
import EditAccumulatedSettingModal from './editAccumulatedSettingModal';

import CreateTimelySettingModal from './createTimelySettingModal';
import EditTimelySettingModal from './editTimelySettingModal';

import CreateFullSettingModal from './createFullSettingModal';
import EditFullSettingModal from './editFullSettingModal';



export default class HelperModals extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.key = 0;
  }

  componentWillReceiveProps(nextProps){
    //console.debug('HelperModals componentWillReceiveProps');
  }

  componentWillUpdate(nextProps, nextState){
    //console.debug('HelperModals componentWillUpdate');
  }

  componentDidUpdate(prevProps, prevState){
    //console.debug('HelperModals componentDidUpdate');
  }




  render() {
    return (
      <div>
          <CreateAccumulatedSettingModal key={this.key++} {...this.props}/>
          <EditAccumulatedSettingModal key={this.key++} {...this.props}/>
          <CreateTimelySettingModal key={this.key++} {...this.props}/>
          <EditTimelySettingModal key={this.key++} {...this.props}/>
          <CreateFullSettingModal key={this.key++} {...this.props}/>
          <EditFullSettingModal key={this.key++} {...this.props}/>
      </div>
    );
  }
}
