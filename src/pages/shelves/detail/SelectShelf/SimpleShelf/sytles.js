import { css } from '@emotion/core';

const IconSize = 38;
const IconBorderWidth = 2;

export const simpleShelf = css`
  background: white;
  border-radius: 4px;
  margin: 16px;
`;

export const shelfName = css`
  font-size: 18px;
  font-weight: bold;
  color: #303538;
`;

export const shelfBookCount = css`
  font-size: 14px;
  color: #9ea7ad;
`;

export const checkButton = css`
  display: block;
  position: relative;
  width: ${IconSize + IconBorderWidth * 2}px;
  height: ${IconSize + IconBorderWidth * 2}px;
`;

export const checkIconBorder = css`
  display: block;
  width: ${IconSize}px;
  height: ${IconSize}px;
  background: rgba(0, 0, 0, 0.5);
  border: ${IconBorderWidth}px solid rgba(0, 0, 0, 0.5);
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
