/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ServiceError from './base/ServiceError';

export const PageLoadError = () => {
  const renderErrorMessage = () => (
    <React.Fragment>
      <strong>요청하신 페이지 불러오지 못했습니다.</strong>
      <br />
      잠시 후 다시 시도해 주세요.
    </React.Fragment>
  );

  const notFoundProps = {
    errorMessage: renderErrorMessage,
    reloadButton: true,
  };
  return <ServiceError {...notFoundProps} />;
};
