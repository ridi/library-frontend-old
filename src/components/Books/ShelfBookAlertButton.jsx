import React from 'react';
import { Disabled } from './Disabled';
import FullButton from './FullButton';

export const ShelfBookAlertButton = props => (
  <>
    <Disabled />
    <FullButton>
      <button type="button" onClick={props.onClickShelfBook}>
        콜렉션 도서 선택 안내
      </button>
    </FullButton>
  </>
);
