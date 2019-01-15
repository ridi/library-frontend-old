/** @jsx jsx */
import { jsx } from '@emotion/core';
import LNBBar from '../LNBBar';
import SearchBox from './SearchBox';
import Tool from '../Tool';
import * as styles from './styles';

const SearchBar = ({
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
  <LNBBar
    hideTools={hideTools}
    renderFlexLeft={() => (
      <div css={styles.searchBoxWrapper}>
        <SearchBox keyword={keyword} onSubmit={handleOnSubmitSearchBar} onFocus={handleOnFocusSearchBar} onBlur={handleOnBlurSearchBar} />
      </div>
    )}
    renderFlexRight={() => (
      <div css={styles.toolsWrapper}>
        <Tool
          filter={filter}
          toggleFilterModal={toggleFilterModal}
          edit={edit}
          toggleEditingMode={toggleEditingMode}
          more={more}
          toggleMoreModal={toggleMoreModal}
        />
      </div>
    )}
  />
);

export default SearchBar;
