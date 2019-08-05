import { css } from '@emotion/core';

export const wrapper = css`
  border-radius: 4px;
  background-color: #e6e8eb;
  padding: 13px 16px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
`;

const iconSize = 16;

export const icon = css`
  width: ${iconSize}px;
  height: ${iconSize}px;
  fill: #9ea7ad;
  margin-right: 8px;
  flex: 0 0 auto;
`;

export const message = css`
  line-height: 1.38em;
  color: #525a61;
  font-size: 13px;
`;
