/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import BookOutline from '../../svgs/BookOutline.svg';
import ComponentError from './base/ComponentError';

export const BookError = ({ onClickRefreshButton }) => {
  const renderErrorMessage = () => (
    <React.Fragment>
      도서의 정보 구성 중 오류가 발생했습니다.
      <br />
      잠시 후 다시 시도해주세요.
    </React.Fragment>
  );
  return <ComponentError ErrorIcon={BookOutline} errorMessage={renderErrorMessage} onClickRefreshButton={onClickRefreshButton} />;
};
