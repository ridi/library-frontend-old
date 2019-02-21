import { Global } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import Confirm from '../../components/Confirm';
import Dialog from '../../components/Dialog';
import FullScreenLoading from '../../components/FullScreenLoading';
import Toaster from '../../components/Toaster';
import { closeConfirm } from '../../services/confirm/actions';
import { closeDialog } from '../../services/dialog/actions';
import GNB from './GNB';
import { globalStyles } from './styles';

class Layout extends React.Component {
  render() {
    const { children, showFullScreenLoading, confirm, dispatchCloseConfirm, dialog, dispatchCloseDialog } = this.props;
    return (
      <>
        <Global styles={globalStyles} />
        <GNB />
        {children}
        <Toaster />
        {confirm ? <Confirm onClickCloseButton={() => dispatchCloseConfirm()} {...confirm} /> : null}
        {dialog ? <Dialog onClickCloseButton={() => dispatchCloseDialog()} {...dialog} /> : null}
        {showFullScreenLoading ? <FullScreenLoading /> : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  showFullScreenLoading: state.ui.fullScreenLoading,
  dialog: state.dialog,
  confirm: state.confirm,
});

const mapDispatchToProps = {
  dispatchCloseDialog: closeDialog,
  dispatchCloseConfirm: closeConfirm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layout);
