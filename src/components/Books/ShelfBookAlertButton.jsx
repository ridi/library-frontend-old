import React from 'react';
import { Disabled } from './Disabled';
import FullButton from './FullButton';

export const ShelfBookAlertButton = props => {
  const { onClickShelfBook } = props;
  return (
    <>
      <Disabled />
      <FullButton>
        <button type="button" onClick={onClickShelfBook}>
          콜렉션 도서 선택 안내
        </button>
      </FullButton>
    </>
  );
};
