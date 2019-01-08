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
  toggleFilterModal,
  toggleEditingMode,
  toggleMoreModal,
}) => (
  <Responsive className={hideTools ? 'hideTools' : ''} css={styles.toolBar}>
    <div css={styles.flexWrapper}>
      <div css={styles.toolBarSearchBarWrapper}>
        <SearchBar onSubmit={handleOnSubmitSearchBar} onFocus={handleOnFocusSearchBar} onBlur={handleOnBlurSearchBar} />
      </div>
      <div css={styles.toolBarToolsWrapper}>
        <IconButton a11y="필터" css={styles.toolBarIconButton} onClick={toggleFilterModal}>
          <CategoryFilter css={styles.categoryFilterIcon} />
        </IconButton>
        <IconButton a11y="편집" css={styles.toolBarIconButton} onClick={toggleEditingMode}>
          <Edit css={styles.editIcon} />
        </IconButton>
        <IconButton a11y="정렬" css={styles.toolBarIconButton} onClick={toggleMoreModal}>
          <ThreeDots css={styles.threeDotsIcon} />
        </IconButton>
      </div>
    </div>
  </Responsive>
);

export default ToolBar;
