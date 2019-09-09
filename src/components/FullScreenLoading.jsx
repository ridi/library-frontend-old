/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { disableScroll, enableScroll } from '../utils/scroll';

import LoadingSpinner from './LoadingSpinner';

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
  spinner: {
    width: 32,
    height: 32,
  },
};

export default class FullScreenLoading extends React.Component {
  componentDidMount() {
    disableScroll();
  }

  componentWillUnmount() {
    enableScroll();
  }

  render() {
    return (
      <div css={styles.background}>
        <LoadingSpinner css={styles.spinner} />
      </div>
    );
  }
}
