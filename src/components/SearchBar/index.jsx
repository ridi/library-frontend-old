/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import Link from 'next/link';
import Router from 'next/router';
import { URLMap } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import FlexBar from '../FlexBar';
import { Editing, Filter, More } from '../Tool';
import SearchBox from './SearchBox';
import * as styles from './styles';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: props.keyword || '',
      hideTools: false,
    };
  }

  handleKeywordChange = value => this.setState({ keyword: value });

  handleOnSubmitSearchBar = () => {
    const { keyword } = this.state;
    const linkProps = makeLinkProps({ pathname: URLMap.search.href }, URLMap.search.as, { keyword });
    Router.push(linkProps.href, linkProps.as);
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
    const { hideTools, keyword } = this.state;
    const { filter, filterOptions, order, orderOptions, orderBy, orderType, toggleEditingMode, isSearchPage } = this.props;

    const left = (
      <div css={styles.searchBoxWrapper}>
        <SearchBox
          keyword={keyword}
          onKeywordChange={this.handleKeywordChange}
          onSubmit={this.handleOnSubmitSearchBar}
          onFocus={this.handleOnFocusSearchBar}
          onBlur={this.handleOnBlurSearchBar}
          isSearchPage={isSearchPage}
        />
      </div>
    );
    const right = (
      <div css={styles.toolsWrapper}>
        {filterOptions && <Filter filter={filter} filterOptions={filterOptions} query={{ orderType, orderBy }} />}
        {toggleEditingMode && <Editing toggleEditingMode={toggleEditingMode} />}
        {orderOptions && <More order={order} orderOptions={orderOptions} query={{ filter }} showViewType showOrder showHidden />}
        {isSearchPage && (
          <Link prefetch {...makeLinkProps(URLMap.main.href, URLMap.main.as)}>
            <a css={styles.cancelSearchButton}>취소</a>
          </Link>
        )}
      </div>
    );

    return <FlexBar css={styles.searchBar} hideTools={hideTools} flexLeft={left} flexRight={right} />;
  }
}

export default SearchBar;
