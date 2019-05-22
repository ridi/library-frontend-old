/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState } from 'react';
import Link from 'next/link';
import { URLMap, PageType } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import { shelfStyles } from './styles/shelf';
import ThreeDotsVertical from '../../svgs/ThreeDotsVertical.svg';
import IconButton from '../IconButton';

export const Shelf = props => {
  const [editModalActive, setEditModalActive] = useState(false);

  const THUMBNAIL_TOTAL_COUNT = 3;
  const { id: uuid, name, totalCount, thumbnails, selectMode } = props;
  const { href, as } = URLMap[PageType.SHELVES]; // TODO : 책장 상세로 바꿔야함
  thumbnails.length = THUMBNAIL_TOTAL_COUNT;

  const EditButton = editable =>
    editable ? (
      <div css={shelfStyles.editWrapper} className={editModalActive ? 'active' : ''}>
        <IconButton
          css={shelfStyles.editButton}
          onClick={() => {
            setEditModalActive(!editModalActive);
          }}
          a11y="편집"
        >
          <ThreeDotsVertical css={shelfStyles.editButtonIcon} />
        </IconButton>
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

  return (
    <article css={shelfStyles.wrapper}>
      <ul css={shelfStyles.thumbnails}>
        {Array.from(thumbnails.keys()).map(index => {
          const thumbnailUrl = thumbnails[index];
          const key = `shelves-${uuid}-thumbnail${index}-${thumbnailUrl}`;
          return (
            <li css={shelfStyles.thumbnail} key={key}>
              {thumbnailUrl ? <img src={thumbnailUrl} alt={`${name} 대표 이미지`} /> : <p>비었음</p>}
            </li>
          );
        })}
      </ul>
      <div css={shelfStyles.infoWrapper}>
        <div css={shelfStyles.nameWrapper}>
          <h1 css={shelfStyles.name}>책장명 {name}</h1>
        </div>
        <div css={shelfStyles.countWrapper}>
          <p css={shelfStyles.count}>총 {totalCount || 0}권</p>
        </div>
      </div>
      <Link prefetch {...makeLinkProps(href, as, { uuid })}>
        <a css={shelfStyles.link}>{name} 바로가기</a>
      </Link>
      <EditButton editable />
      {selectMode && <div>선택모드 활성화</div>}
    </article>
  );
};
