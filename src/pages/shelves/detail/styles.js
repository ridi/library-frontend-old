import { css } from '@emotion/core';
import { ACTION_BAR_HEIGHT } from '../../../components/ActionBar/styles';

export const shelfBar = css`
  background-color: white;
  border-top: 1px solid #f3f4f5;
  border-bottom: 1px solid #d1d5d9;
  margin-top: -1px;
`;

export const toolsWrapper = css`
  flex: auto;
  justify-content: flex-end;
  display: flex;
  align-items: center;
  padding-left: 2px;
  white-space: nowrap;
`;

export const paddingForPagination = css`
  padding-bottom: ${ACTION_BAR_HEIGHT};
`;

export const toolBar = css`
  border-bottom: 1px solid #d1d5d9;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
  background-color: #f3f4f5;
`;
