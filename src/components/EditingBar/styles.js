import { css } from '@emotion/core';

export const editingBarWrapper = css`
  background-color: #0077d9;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.04);
  width: 100%;
`;

export const editingBar = css`
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const editingBarIconWrapper = css`
  flex: auto;
  display: flex;
  align-items: center;
`;

export const editingBarIcon = css`
  width: 18px;
  height: 18px;
  fill: white;
  margin-right: 4px;
`;

export const editingBarSelectCount = css`
  display: inline-block;
  font-size: 15px;
  color: white;
`;

export const editingBarCompleteButton = css`
  width: 52px;
  height: 30px;
  line-height: 28px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #d1d5d9;
  box-sizing: border-box;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  color: #0077d9;
`;
