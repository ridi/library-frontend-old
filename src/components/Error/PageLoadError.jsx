import React from 'react';
import ServiceError from './base/ServiceError';

export const PageLoadError = () => (
  <ServiceError reloadButton>
    <strong>요청하신 페이지를 불러오지 못했습니다.</strong>
    <br />
    잠시 후 다시 시도해 주세요.
  </ServiceError>
);
