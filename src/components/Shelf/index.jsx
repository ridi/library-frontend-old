/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import * as selectors from '../../services/shelf/selectors';
import ArrowTriangleRight from '../../svgs/ArrowTriangleRight.svg';
import { ShelfDetailLink } from './ShelfDetailLink';
import { ShelfEditButton } from './ShelfEditButton';
import { ShelfSelectButton } from './ShelfSelectButton';
import { shelfStyles } from './styles';
import { ShelfThumbnails } from './ShelfThumbnail';
import { toggleItem } from '../../services/selection/actions';

const Shelf = props => {
  const { uuid, name, totalCount, thumbnailIds, editable, selectMode } = props;

  return (
    <article css={shelfStyles.wrapper}>
      <ShelfThumbnails thumbnailIds={thumbnailIds} shelfName={name} />
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
      <ShelfEditButton uuid={uuid} editable={editable} />
      <ShelfSelectButton uuid={uuid} isActive={selectMode} />
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
  };
};

const mapDispatchToProps = {
  onSelectedChange: toggleItem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shelf);
