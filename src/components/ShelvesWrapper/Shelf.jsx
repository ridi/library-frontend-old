/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { URLMap, PageType } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import { shelfStyles } from './styles/shelf';

export const Shelf = props => {
  const THUMBNAIL_TOTAL_COUNT = 3;
  const { id: uuid, name, totalCount, thumbnails, selectMode } = props;
  const { href, as } = URLMap[PageType.SHELVES]; // TODO : 책장 상세로 바꿔야함
  thumbnails.length = THUMBNAIL_TOTAL_COUNT;

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
        <h1 css={shelfStyles.name}>책장명 {name}</h1>
        <p>총 {totalCount || 0}권</p>
        {/* {editList && <div>{editList}</div>} */}
      </div>
      <Link prefetch {...makeLinkProps(href, as, { uuid })}>
        <a>{name} 바로가기</a>
      </Link>
      {selectMode && <div>선택모드 활성화</div>}
    </article>
  );
};
