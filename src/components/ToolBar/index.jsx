/** @jsx jsx */
import { jsx } from '@emotion/core';
import Responsive from '../../pages/base/Responsive';
import IconButton from '../IconButton';
import SearchBar from '../SearchBar';
import * as styles from './styles';

import CategoryFilter from '../../svgs/CategoryFilter.svg';
import Edit from '../../svgs/Edit.svg';
import ThreeDots from '../../svgs/ThreeDots.svg';

const ToolBar = ({
  hideTools,
  handleOnSubmitSearchBar,
  handleOnFocusSearchBar,
  handleOnBlurSearchBar,
  keyword = '',
  filter,
  toggleFilterModal,
  edit,
  toggleEditingMode,
  more,
  toggleMoreModal,
}) => (
  <Responsive className={hideTools ? 'hideTools' : ''} css={styles.toolBar}>
    <div css={styles.flexWrapper}>
      <div css={styles.toolBarSearchBarWrapper}>
        <SearchBar keyword={keyword} onSubmit={handleOnSubmitSearchBar} onFocus={handleOnFocusSearchBar} onBlur={handleOnBlurSearchBar} />
      </div>
      <div css={styles.toolBarToolsWrapper}>
        {filter && (
          <IconButton a11y="필터" css={styles.toolBarIconButton} onClick={toggleFilterModal}>
            <CategoryFilter css={styles.categoryFilterIcon} />
          </IconButton>
        )}
        {edit && (
          <IconButton a11y="편집" css={styles.toolBarIconButton} onClick={toggleEditingMode}>
            <Edit css={styles.editIcon} />
          </IconButton>
        )}
        {more && (
          <IconButton a11y="정렬" css={styles.toolBarIconButton} onClick={toggleMoreModal}>
            <ThreeDots css={styles.threeDotsIcon} />
          </IconButton>
        )}
      </div>
    </div>
  </Responsive>
);

export default ToolBar;
