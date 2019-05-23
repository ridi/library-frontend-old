/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { PageType, URLMap } from '../../constants/urls';
import ArrowTriangleRight from '../../svgs/ArrowTriangleRight.svg';
import { makeLinkProps } from '../../utils/uri';
import { ShelfEditButton } from './ShelfEditButton';
import { shelfStyles } from './styles/shelf';
import { ShelfSelectButton } from './ShelfSelectButton';

export const Shelf = props => {
  const THUMBNAIL_TOTAL_COUNT = 3;
  const { id: uuid, name, totalCount, thumbnails, selectMode } = props;
  const { href, as } = URLMap[PageType.SHELVES]; // TODO : 책장 상세로 바꿔야함

  return (
    <article css={shelfStyles.wrapper}>
      <ul css={shelfStyles.thumbnails}>
        {Array.from({ length: THUMBNAIL_TOTAL_COUNT }, (_, index) => {
          const thumbnailUrl = thumbnails[index];
          const key = `shelf-${uuid}-thumbnail${index}-${thumbnailUrl}`;
          return (
            <li css={shelfStyles.thumbnail} key={key}>
              {thumbnailUrl ? <img src={thumbnailUrl} alt={`${name} 대표 이미지`} /> : <p>비었음</p>}
            </li>
          );
        })}
      </ul>
      <div css={shelfStyles.infoWrapper}>
        <div css={shelfStyles.nameWrapper}>
          <h1 css={shelfStyles.name}>{name}</h1>
        </div>
        <div css={shelfStyles.countWrapper}>
          <p css={shelfStyles.count}>
            총 {totalCount || 0}권
            <ArrowTriangleRight css={shelfStyles.countArrowIcon} />
          </p>
        </div>
      </div>
      <Link prefetch {...makeLinkProps(href, as, { uuid })}>
        <a css={shelfStyles.link}>{name} 바로가기</a>
      </Link>
      <ShelfEditButton editable />
      <ShelfSelectButton selectMode />
    </article>
  );
};
