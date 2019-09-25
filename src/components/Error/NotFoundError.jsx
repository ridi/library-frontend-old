import React from 'react';
import ServiceError from './base/ServiceError';

export const NotFoundError = () => (
  <ServiceError errorTitle="404" prevPageButton homeButton>
    <strong>요청하신 페이지가 없습니다.</strong>
    <br />
    입력하신 주소를 확인해 주세요.
  </ServiceError>
);
