import { Global } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import BookDownLoader from '../../components/BookDownLoader';
import Confirm from '../../components/Confirm';
import Dialog from '../../components/Dialog';
import FullScreenLoading from '../../components/FullScreenLoading';
import Maintenance from '../../components/Maintenance';
import Prompt from '../../components/Prompt';
import Toaster from '../../components/Toaster';
import { closeConfirm } from '../../services/confirm/actions';
import { closeDialog } from '../../services/dialog/actions';
import { closePrompt } from '../../services/prompt/actions';
import { Environment } from './Environment';
import GNB from './GNB';
import { globalStyles } from './styles';

const Layout = props => {
  const {
    children,
    showFullScreenLoading,
    confirm,
    dispatchCloseConfirm,
    dialog,
    dispatchCloseDialog,
    prompt,
    dispatchClosePrompt,
    maintenance,
  } = props;
  return (
    <>
      <Global styles={[globalStyles]} />
      <Environment />
      {maintenance.visible && <Maintenance terms={maintenance.terms} unavailableServiceList={maintenance.unavailableServiceList} />}
      {maintenance.visible === false && (
        <>
          <BookDownLoader />
          <GNB />
          {children}
          {confirm ? <Confirm onClickCloseButton={() => dispatchCloseConfirm()} {...confirm} /> : null}
          {dialog ? <Dialog onClickCloseButton={() => dispatchCloseDialog()} {...dialog} /> : null}
          {prompt ? <Prompt onClickCloseButton={() => dispatchClosePrompt()} {...prompt} /> : null}
          {showFullScreenLoading ? <FullScreenLoading fixed /> : null}
          <Toaster />
        </>
      )}
    </>
  );
};

const mapStateToProps = state => {
  const { ui, dialog, confirm, maintenance, prompt } = state;
  return {
    showFullScreenLoading: ui.fullScreenLoading,
    dialog,
    confirm,
    maintenance,
    prompt,
  };
};

const mapDispatchToProps = {
  dispatchCloseDialog: closeDialog,
  dispatchCloseConfirm: closeConfirm,
  dispatchClosePrompt: closePrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layout);
