/** @jsx jsx */
import React from 'react';
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

export default class FullScreenLoading extends React.Component {
  constructor(props) {
    super(props);

    this.body = document.querySelector('body');
  }

  componentDidMount() {
    this.disableScrolling();
  }

  componentWillUnmount() {
    this.enableScrolling();
  }

  enableScrolling = () => {
    this.body.style.overflow = '';
  };

  disableScrolling = () => {
    this.body.style.overflow = 'hidden';
  };

  render() {
    return (
      <div css={styles.background}>
        <div css={styles.spinner}>Loading...</div>
      </div>
    );
  }
}
