/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import * as selectors from '../../services/shelf/selectors';
import { thousandsSeperator } from '../../utils/number';
import { ShelfDetailLink } from './ShelfDetailLink';
import { ShelfSelectButton } from './ShelfSelectButton';
import { ShelfThumbnails } from './ShelfThumbnail';
import { shelfStyles } from './styles';

function defaultRenderLink({ uuid, name }) {
  return <ShelfDetailLink uuid={uuid} name={name} />;
}

const TotalCount = ({ count }) => (count && count > 0 ? <p css={shelfStyles.count}>{thousandsSeperator(count)}</p> : null);

const Shelf = props => {
  const { uuid, name, totalCount, thumbnailIds, renderLink = defaultRenderLink, selectMode } = props;

  return (
    <article css={shelfStyles.wrapper}>
      <ShelfThumbnails thumbnailIds={thumbnailIds} shelfName={name} />
      <div css={shelfStyles.infoWrapper}>
        <h1 css={[shelfStyles.namePadding, shelfStyles.name]}>{name}</h1>
        <div css={shelfStyles.countWrapper}>
          <TotalCount count={totalCount} />
        </div>
      </div>
      {renderLink({ uuid, name })}
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

export default connect(mapStateToProps)(Shelf);
