/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';

import { jsx } from '@emotion/core';
import { disableScroll, enableScroll } from '../utils/scroll';

const styles = {
  dialogWrapper: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(33, 37, 41, 0.6)',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dialog: {
    borderRadius: 3,
    backgroundColor: 'white',

    width: 300,
    padding: 20,
    boxSizing: 'border-box',
  },

  dialogHeader: {
    position: 'relative',
  },
  dialogTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 1.41,
    letterSpacing: -0.3,
    color: '#303538',
  },
  dialogCloseButton: {
    position: 'absolute',
    top: 0,
    right: 0,

    width: 15,
    height: 15,

    backgroundColor: 'red',
  },

  dialogContent: {
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#525a61',

    margin: '20px 0',
  },
  dialogFooter: {},
  dialogButton: {
    width: 92,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#1f8ce6',

    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    textAlign: 'center',
    color: '#ffffff',
    float: 'right',
  },
  clear: {
    clear: 'both',
  },
};

export default class Dialog extends React.Component {
  componentDidMount() {
    disableScroll();
  }

  componentWillUnmount() {
    enableScroll();
  }

  render() {
    const { title, message, onClickCloseButton } = this.props;
    return (
      <div css={styles.dialogWrapper}>
        <div css={styles.dialog}>
          <div css={styles.dialogHeader}>
            <div css={styles.dialogTitle}>{title}</div>
            <button type="button" css={styles.dialogCloseButton} onClick={onClickCloseButton} />
          </div>
          <div css={styles.dialogContent}>{message}</div>
          <div css={styles.dialogFooter}>
            <button type="button" css={styles.dialogButton} onClick={onClickCloseButton}>
              확인
            </button>
            <div css={styles.clear} />
          </div>
        </div>
      </div>
    );
  }
}
