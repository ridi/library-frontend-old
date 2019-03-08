/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { continueButton } from './styles';

export default class ContinueButton extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <button type="button" css={continueButton}>
        이어보기
      </button>
    );
  }
}
