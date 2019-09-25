/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ServiceError from './base/ServiceError';

const ErrorMessage = () => (
  <React.Fragment>
    <strong>요청하신 페이지가 없습니다.</strong>
    <br />
    입력하신 주소를 확인해 주세요.
  </React.Fragment>
);

export const NotFoundError = () => <ServiceError errorTitle="404" errorMessage={<ErrorMessage />} prevPageButton homeButton />;
