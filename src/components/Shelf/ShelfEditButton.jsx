/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import ThreeDotsVertical from '../../svgs/ThreeDotsVertical.svg';
import IconButton from '../IconButton';
import { shelfStyles } from './styles';

export const ShelfEditButton = editable => {
  const [modalActive, setModalActive] = useState(false);

  return editable ? (
    <div css={shelfStyles.editWrapper} className={modalActive ? 'active' : ''}>
      <IconButton
        css={shelfStyles.editButton}
        onClick={() => {
          setModalActive(prevActive => !prevActive);
        }}
        a11y="편집"
      >
        <ThreeDotsVertical css={shelfStyles.editButtonIcon} />
      </IconButton>
      <button
        type="button"
        onClick={() => {
          setModalActive(prevActive => !prevActive);
        }}
        css={shelfStyles.editModalCloseButton}
      >
        <span className="a11y">책장 편집 모달 닫기 버튼</span>
      </button>
      <div css={shelfStyles.editModalWrapper}>
        <ul css={shelfStyles.editModal}>
          <li>
            <button type="button" css={shelfStyles.editModalButton}>
              책장 이름 변경
            </button>
          </li>
          <li>
            <button type="button" css={shelfStyles.editModalButton}>
              책장 삭제
            </button>
          </li>
        </ul>
      </div>
    </div>
  ) : null;
};
