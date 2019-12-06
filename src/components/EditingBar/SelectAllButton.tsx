import { css } from '@emotion/core';
import React from 'react';

export const buttonStyle = css`
  font-size: 15px;
  color: white;
  padding: 8px;
  margin-right: 8px;
`;

interface SelectAllButtonProps {
  isSelectedAll: boolean;
  handleSelectAllClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleDeselectAllClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const SelectAllButton: React.FC<SelectAllButtonProps> = ({ isSelectedAll, handleSelectAllClick, handleDeselectAllClick }) => (
  <button type="button" css={buttonStyle} onClick={isSelectedAll ? handleDeselectAllClick : handleSelectAllClick}>
    {isSelectedAll ? '선택 해제' : '전체 선택'}
  </button>
);

export default SelectAllButton;
