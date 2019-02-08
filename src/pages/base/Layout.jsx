import React from 'react';
import { connect } from 'react-redux';
import { Global } from '@emotion/core';
import { globalStyles } from './styles';
import GNB from './GNB';
import Toaster from '../../components/Toaster';
import FullScreenLoading from '../../components/FullScreenLoading';

class Layout extends React.Component {
  render() {
    const { children, isLoading } = this.props;
    return (
      <>
        <Global styles={globalStyles} />
        <GNB />
        {children}
        <Toaster />
        {isLoading ? <FullScreenLoading /> : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.fullScreenLoading,
});

export default connect(mapStateToProps)(Layout);
