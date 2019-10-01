import { css } from '@emotion/core';

export const wrapper = css`
  border-radius: 4px;
  background-color: #e6e8eb;
  padding: 13px 16px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
`;

const alertIconSize = 16;

export const alertIcon = css`
  width: ${alertIconSize}px;
  height: ${alertIconSize}px;
  fill: #9ea7ad;
  margin-right: 8px;
  flex: 0 0 auto;
`;

export const message = css`
  line-height: 1.38em;
  color: #525a61;
  font-size: 13px;
  word-break: keep-all;
`;

export const link = css`
  font-size: 13px;
  font-weight: bold;
  color: #525a61;
  text-decoration: underline;
  margin-left: 8px;

  &:link,
  &:visited {
    text-decoration: underline;
  }
`;

export const linkArrowIcon = css`
  width: 8px;
  height: 10px;
  fill: #9ea7ad;
  margin-top: 1px;
  margin-left: 2px;
`;
