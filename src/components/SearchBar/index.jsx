import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { URLMap } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import FlexBar from '../FlexBar';
import SearchBox from '../SearchBox';
import { Editing, Filter, More } from '../Tool';
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
    const { history } = this.props;
    const { keyword } = this.state;
    const linkProps = makeLinkProps({}, URLMap.search.as, { keyword });
    history.push(linkProps.to);
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

  handleFilterChange = filter => {
    const { history, orderBy, orderDirection } = this.props;
    const { to } = makeLinkProps({}, URLMap.main.as, { orderBy, orderDirection, filter });
    history.push(to);
  };

  render() {
    const { hideTools, keyword } = this.state;
    const { filter, filterOptions, orderOptions, orderDirection, orderBy, toggleEditingMode, isSearchPage } = this.props;

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
        {filterOptions && <Filter filter={filter} filterOptions={filterOptions} onFilterChange={this.handleFilterChange} />}
        {toggleEditingMode && <Editing toggleEditingMode={toggleEditingMode} />}
        {orderOptions && (
          <More
            orderOptions={orderOptions}
            orderBy={orderBy}
            orderDirection={orderDirection}
            query={{ filter }}
            showViewType
            showOrder
            showHidden
          />
        )}
        {isSearchPage && (
          <Link {...makeLinkProps({}, URLMap.main.as)} css={styles.cancelSearchButton}>
            취소
          </Link>
        )}
      </div>
    );

    return <FlexBar css={styles.searchBar} hideTools={hideTools} flexLeft={left} flexRight={right} />;
  }
}

export default withRouter(SearchBar);
