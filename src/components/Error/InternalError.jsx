/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ServiceError from './base/ServiceError';

const ErrorMessage = () => (
  <React.Fragment>
    <strong>지금은 접속이 어렵습니다.</strong>
    <br />
    현재 오류 복구에 최선을 다하고 있으니,
    <br />
    잠시 후 다시 접속해주세요.
  </React.Fragment>
);

export const InternalError = () => <ServiceError errorTitle="500" errorMessage={<ErrorMessage />} reloadButton />;
