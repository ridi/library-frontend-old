import { css } from '@emotion/core';

import { MQ, Responsive } from 'commonStyles/responsive';

const IconSize = 38;
const IconBorderWidth = 2;

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

export const simpleShelf = css`
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;

  &.disabled {
    opacity: 0.4;
  }
`;

export const shelfCheckIconWrapper = css`
  flex: 0 0 72px;
  padding: 20px 0;
`;

export const shelfMetaWrapper = css`
  flex: auto;
  padding: 6px 20px 6px 0;
`;

export const shelfName = css`
  font-size: 18px;
  font-weight: bold;
  color: #303538;
  overflow: hidden;
  display: -webkit-box;
  line-height: 1.4em;
  max-height: 2.8em;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const shelfBookCount = css`
  font-size: 14px;
  color: #9ea7ad;
  margin-top: 3px;
`;

export const checkButton = css`
  display: block;
  position: relative;
  width: ${IconSize + IconBorderWidth * 2}px;
  height: ${IconSize + IconBorderWidth * 2}px;
  cursor: pointer;
  margin: 0 auto;

  .disabled & {
    cursor: default;
  }
`;

export const checkIconBorder = css`
  display: block;
  width: ${IconSize}px;
  height: ${IconSize}px;
  background: #b3b3b3;
  border: ${IconBorderWidth}px solid #b3b3b3;
  border-radius: 50%;

  .active & {
    background: #1f8ce6;
  }
`;

export const checkIcon = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: ${IconSize}px;
  height: ${IconSize}px;
  fill: white;
`;
