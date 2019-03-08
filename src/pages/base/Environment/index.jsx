/** @jsx jsx */
import { jsx } from '@emotion/core';
import config from '../../../config';

const environmentStyle = environment => {
  let background = '';
  if (environment === 'local') {
    background = 'darkgray';
  } else if (environment === 'development') {
    background = 'green';
  } else if (environment === 'staging') {
    background = 'red';
  }

  return {
    textAlign: 'center',
    padding: '4px',
    fontSize: '12px',
    fontWeight: 900,
    color: 'white',
    background,
  };
};

export const Environment = () => {
  const { ENVIRONMENT: environment } = config;
  const isShow = environment === 'local' || environment === 'development' || environment === 'staging';
  return isShow ? <p css={environmentStyle(environment)}>{environment}</p> : null;
};
