import { css } from '@emotion/core';

const titleHeight = 30;

export const InvertColor = 'color-invert';

export const TitleBar = css`
  background-color: white;
  border-top: 1px solid #f3f4f5;
  border-bottom: 1px solid #d1d5d9;
  margin-top: -1px;

  &.${InvertColor} {
    background-color: #0077d9;
    border-top: 0;
    border-bottom: 0;
    margin-top: 0;
  }
`;

export const Title = css`
  display: flex;
  align-items: center;
  height: 46px;
  overflow: hidden;
`;

export const BackButton = css`
  display: block;
  padding: 15px 10px 14px 0;
  line-height: 0;
`;

export const BackIcon = css`
  width: 16px;
  height: 16px;
  fill: #40474d;

  .${InvertColor} & {
    fill: white;
  }
`;

export const TitleTextWrapper = css`
  height: ${titleHeight}px;
  width: 100%;
  display: flex;
  min-width: 0;
  align-items: center;
`;

export const TitleText = css`
  font-size: 16px;
  font-weight: 700;
  color: #40474d;
  height: ${titleHeight}px;
  line-height: ${titleHeight}px;

  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;

  .${InvertColor} & {
    color: white;
  }
`;

export const Count = css`
  padding-left: 6px;
  font-size: 15px;
  font-weight: 400;
  height: ${titleHeight - 1}px;
  line-height: ${titleHeight - 1}px;
  color: #808991;

  .${InvertColor} & {
    color: white;
  }
`;
