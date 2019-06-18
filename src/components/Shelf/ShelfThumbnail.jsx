/** @jsx jsx */
import { jsx } from '@emotion/core';
import { shelfStyles } from './styles';

const THUMBNAIL_TOTAL_COUNT = 3;
export const ShelfThumbnails = ({ thumbnailIds, shelfName }) => (
  <ul css={shelfStyles.thumbnails}>
    {Array.from({ length: THUMBNAIL_TOTAL_COUNT }, (_, index) => {
      const thumbnailUrl = thumbnailIds[index] ? `//misc.ridibooks.com/cover/${thumbnailIds[index]}/xxlarge` : '';
      const hasThumbnail = thumbnailUrl.length > 0;
      const key = hasThumbnail ? thumbnailUrl : `empty${index}`;
      return (
        <li css={shelfStyles.thumbnail} key={key}>
          <div className="thumbnailImage" css={shelfStyles.thumbnailImage}>
            {hasThumbnail ? (
              <img css={shelfStyles.image} src={thumbnailUrl} alt={`${shelfName} 대표 이미지`} />
            ) : (
              <span className="a11y">책장 구성도서 썸네일 영역</span>
            )}
          </div>
        </li>
      );
    })}
  </ul>
);
