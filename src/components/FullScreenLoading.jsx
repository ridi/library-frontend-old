/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { jsx } from '@emotion/core';

const styles = {
  background: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  spinner: {},
};

class FullScreenLoading extends React.Component {
  render() {
    const { isLoading } = this.props;

    if (!isLoading) {
      return null;
    }

    return (
      <div css={styles.background}>
        <div css={styles.spinner}>Loading...</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.fullScreenLoading,
});

export default connect(mapStateToProps)(FullScreenLoading);
