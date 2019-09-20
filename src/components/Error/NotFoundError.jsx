/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ServiceError from './base/ServiceError';

export const NotFoundError = () => {
  const renderErrorMessage = () => (
    <React.Fragment>
      <strong>요청하신 페이지가 없습니다.</strong>
      <br />
      입력하신 주소를 확인해 주세요.
    </React.Fragment>
  );
  const notFoundProps = {
    errorTitle: '404',
    errorMessage: renderErrorMessage,
    prevPageButton: true,
    homeButton: true,
  };
  return <ServiceError {...notFoundProps} />;
};
