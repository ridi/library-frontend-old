import { css } from '@emotion/core';
import React from 'react';

import { disableScroll, enableScroll } from '../utils/scroll';
import LoadingSpinner from './LoadingSpinner';

const styles = {
  background: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  fixed: css`
    background-color: rgba(255, 255, 255, 0.9);
    position: fixed;
    z-index: 9999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  `,
  static: css`
    background-color: #f3f4f5;
    width: 100vw;
    height: 90vh;
  `,
  spinner: css`
    width: 32px;
    height: 32px;
  `,
};

export default class FullScreenLoading extends React.Component {
  componentDidMount() {
    disableScroll();
  }

  componentWillUnmount() {
    enableScroll();
  }

  render() {
    const { fixed: isFixed } = this.props;
    return (
      <div css={[styles.background, isFixed ? styles.fixed : styles.static]}>
        <LoadingSpinner css={styles.spinner} />
      </div>
    );
  }
}
