/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { URLMap } from '../../constants/urls';
import { makeLinkProps, makeURI } from '../../utils/uri';
import FlexBar from '../FlexBar';
import { Editing, Filter, More } from '../Tool';
import SearchBox from './SearchBox';
import * as styles from './styles';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideTools: false,
    };
  }

  handleOnSubmitSearchBar = value => {
    const { href, as } = URLMap.search;
    Router.push(makeURI(href, { keyword: value }), makeURI(as, { keyword: value }));
  };

  handleOnFocusSearchBar = () => {
    this.setState({
      hideTools: true,
    });
  };

  handleOnBlurSearchBar = () => {
    this.setState({
      hideTools: false,
    });
  };

  render() {
    const { hideTools } = this.state;
    const { filter, filterOptions, order, orderOptions, orderBy, orderType, toggleEditingMode, keyword = '' } = this.props;

    return (
      <FlexBar
        css={styles.searchBar}
        hideTools={hideTools}
        flexLeft={
          <div css={styles.searchBoxWrapper}>
            <SearchBox
              keyword={keyword}
              onSubmit={this.handleOnSubmitSearchBar}
              onFocus={this.handleOnFocusSearchBar}
              onBlur={this.handleOnBlurSearchBar}
            />
          </div>
        }
        flexRight={
          <div css={styles.toolsWrapper}>
            {filterOptions && <Filter filter={filter} filterOptions={filterOptions} query={{ orderType, orderBy }} />}
            {toggleEditingMode && <Editing toggleEditingMode={toggleEditingMode} />}
            {orderOptions && <More order={order} orderOptions={orderOptions} query={{ filter }} showViewType showOrder showHidden />}
            {keyword && (
              <Link prefetch {...makeLinkProps(URLMap.main.href, URLMap.main.as)}>
                <a css={styles.cancelSearchButton}>취소</a>
              </Link>
            )}
          </div>
        }
      />
    );
  }
}

export default SearchBar;
