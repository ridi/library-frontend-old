import { css } from '@emotion/core';
import { MQ, Responsive, BP } from '../../../styles/responsive';

const ResponsiveInfoWrapper = `
  ${MQ(
    [Responsive.XSmall],
    `
      background: pink;
    `,
  )}
  ${MQ(
    [Responsive.Small, Responsive.Medium, Responsive.Large],
    `
      background: cyan;
    `,
  )}
  ${MQ(
    [Responsive.XLarge, Responsive.XXLarge],
    `
      background: green;
    `,
  )}
`;

const ResponsiveName = `
  ${MQ(
    [Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large],
    `
      padding: 8px 7px; font-size: 15px;
    `,
  )}
  ${MQ(
    [Responsive.XLarge, Responsive.XXLarge],
    `
      padding: 14px 11px; font-size: 17px;
    `,
  )}
`;

export const shelfStyles = {
  wrapper: css`
    border: 1px solid #d1d5d9;
    border-radius: 4px;
    overflow: hidden;
    background: white;
    position: relative;
  `,
  thumbnails: css`
    display: flex;
    flex-flow: row nowrap;
    border-bottom: 1px solid #d1d5d9;
  `,
  thumbnail: css`
    background: #e6e8eb;
    border-left: 1px solid #d1d5d9;
    flex: 1;
    &:first-child {
      border-left: 0;
    }
    img {
      width: 100%;
      height: 100%;
    }
  `,
  infoWrapper: css`
    ${ResponsiveInfoWrapper}
  `,
  name: css`
    font-weight: bold;
    color: #40474d;
    line-height: 1.2em;
    ${ResponsiveName}
  `,
};
