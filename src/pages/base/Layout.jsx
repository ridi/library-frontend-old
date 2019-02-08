import React from 'react';
import { connect } from 'react-redux';
import { Global } from '@emotion/core';
import { globalStyles } from './styles';
import GNB from './GNB';
import Toaster from '../../components/Toaster';
import FullScreenLoading from '../../components/FullScreenLoading';
import Dialog from '../../components/Dialog';

class Layout extends React.Component {
  render() {
    const { children, fullScreenLoading, dialog } = this.props;
    return (
      <>
        <Global styles={globalStyles} />
        <GNB />
        {children}
        <Toaster />
        {dialog ? <Dialog {...dialog} /> : null}
        {fullScreenLoading ? <FullScreenLoading /> : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  fullScreenLoading: state.fullScreenLoading,
  dialog: state.dialog.dialog,
});

export default connect(mapStateToProps)(Layout);
