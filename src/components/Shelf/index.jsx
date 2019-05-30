/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import * as selectors from '../../services/shelf/selectors';
import ArrowTriangleRight from '../../svgs/ArrowTriangleRight.svg';
import { ShelfDetailLink } from './ShelfDetailLink';
import { ShelfEditButton } from './ShelfEditButton';
import { ShelfSelectButton } from './ShelfSelectButton';
import { shelfStyles } from './styles';

const Shelf = props => {
  const THUMBNAIL_TOTAL_COUNT = 3;
  const { uuid, name, totalCount, thumbnailIds, editable, selectMode } = props;
  return (
    <article css={shelfStyles.wrapper}>
      <ul css={shelfStyles.thumbnails}>
        {Array.from({ length: THUMBNAIL_TOTAL_COUNT }, (_, index) => {
          const thumbnailUrl = thumbnailIds[index] ? `//misc.ridibooks.com/cover/${thumbnailIds[index]}/xxlarge` : '';
          const key = `shelf-${uuid}-thumbnail${index}-${thumbnailUrl}`;
          return (
            <li css={shelfStyles.thumbnail} key={key}>
              {thumbnailUrl.length > 0 ? (
                <img className="thumbnailImage" css={shelfStyles.thumbnailImage} src={thumbnailUrl} alt={`${name} 대표 이미지`} />
              ) : (
                <div className="thumbnailImage" css={shelfStyles.thumbnailImage}>
                  <span className="a11y">책장 구성도서 썸네일 영역</span>
                </div>
              )}
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
      <ShelfDetailLink uuid={uuid} name={name} />
      <ShelfEditButton editable={editable} />
      <ShelfSelectButton selectMode={selectMode} />
    </article>
  );
};

const mapStateToProps = (state, props) => {
  const { uuid } = props;
  const name = selectors.getShelfName(state, uuid);
  const thumbnailIds = selectors.getShelfThumbnailIds(state, uuid);
  const totalCount = selectors.getShelfBookCount(state, uuid);
  return {
    name,
    thumbnailIds,
    totalCount,
    editable: false,
    selectMode: false,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shelf);
