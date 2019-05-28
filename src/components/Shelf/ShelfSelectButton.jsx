/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import { shelfStyles } from './styles';
import CheckCircle from '../../svgs/CheckCircle.svg';

export const ShelfSelectButton = ({ id, selectMode }) => {
  const [selected, setSelected] = useState(false);

  return selectMode ? (
    <div css={shelfStyles.selectWrapper}>
      <label
        css={shelfStyles.selectLabel}
        htmlFor={id}
        onClick={event => {
          event.preventDefault();
          setSelected(prevSelected => !prevSelected);
        }}
      >
        <input id={id} type="checkbox" checked={selected} />
        <span css={shelfStyles.selectIconWrapper}>
          <CheckCircle className={selected ? 'active' : ''} css={shelfStyles.selectIcon} />
        </span>
        <span className="a11y">책장 선택</span>
      </label>
    </div>
  ) : null;
};
