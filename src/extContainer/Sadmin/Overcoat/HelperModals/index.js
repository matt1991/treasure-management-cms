import React from 'react';
import ChangePWDModal from './changePWD'
import CloseConfirmModal from './closeConfirm'
import OpenConfirmModal from './openConfirm'
import CloseAccountModal from './closeAccount';
import OpenAccountModal from './openAccount';
import DeleteAccountModal from './deleteAccount';
import CreateAccountModal from './createAccount';
import EditAccountModal from './editAccount';
import ViewImageModal from './viewImage';


export default class HelperModals extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.key = 0;
  }

  render() {
    return (
      <div>
        <ChangePWDModal key={this.key++} {...this.props} />
        <OpenConfirmModal key={this.key++} {...this.props} />
        <CloseConfirmModal key={this.key++} {...this.props} />
        <CloseAccountModal key={this.key++} {...this.props} />
        <OpenAccountModal key={this.key++} {...this.props} />
        <DeleteAccountModal key={this.key++} {...this.props} />
        <CreateAccountModal key={this.key++} {...this.props} />
        <EditAccountModal key={this.key++} {...this.props}/>
        <ViewImageModal key={this.key++} {...this.props} />
      </div>
    );
  }
}
