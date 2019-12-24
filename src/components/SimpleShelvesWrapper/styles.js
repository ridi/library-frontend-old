import { css } from '@emotion/core';

import { MQ, Responsive } from 'commonStyles/responsive';

export const simpleShelves = css`
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 16px 10px;

  ${MQ(
    [Responsive.XSmall],
    `
      padding-left: 6px;
      padding-right: 6px;
    `,
  )}
  ${MQ(
    [Responsive.XLarge],
    `
      width: 800px;
      margin: 0 auto;
    `,
  )}
  ${MQ(
    [Responsive.XXLarge, Responsive.Full],
    `
      width: 1000px;
      margin: 0 auto;
    `,
  )}
`;

export const simpleShelvesItem = css`
  box-sizing: border-box;
  padding: 16px 10px 0 10px;
  width: 100%;
  ${MQ(
    [Responsive.Large, Responsive.XLarge, Responsive.XXLarge, Responsive.Full],
    `
      width: 50%;
    `,
  )}
`;
