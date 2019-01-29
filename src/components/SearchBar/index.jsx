/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { URLMap } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import FlexBar from '../FlexBar';
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
  cancelSearch,
}) => (
  <FlexBar
    css={styles.searchBar}
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
        {cancelSearch && (
          <Link {...makeLinkProps(URLMap.main.href, URLMap.main.as)}>
            <a css={styles.cancelSearchButton}>취소</a>
          </Link>
        )}
      </div>
    )}
  />
);

export default SearchBar;
