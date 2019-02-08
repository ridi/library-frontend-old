import React from 'react';
import { connect } from 'react-redux';
import { Global } from '@emotion/core';
import { globalStyles } from './styles';
import GNB from './GNB';
import Toaster from '../../components/Toaster';
import FullScreenLoading from '../../components/FullScreenLoading';
import Dialog from '../../components/Dialog';

import { closeDialog } from '../../services/dialog/actions';

class Layout extends React.Component {
  render() {
    const { children, showFullScreenLoading, dialog, closeDialog: dispatchCloseDialog } = this.props;
    return (
      <>
        <Global styles={globalStyles} />
        <GNB />
        {children}
        <Toaster />
        {dialog ? <Dialog onClickCloseButton={() => dispatchCloseDialog()} {...dialog} /> : null}
        {showFullScreenLoading ? <FullScreenLoading /> : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  showFullScreenLoading: state.fullScreenLoading,
  dialog: state.dialog.dialog,
});

const mapDispatchToProps = {
  closeDialog,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layout);
