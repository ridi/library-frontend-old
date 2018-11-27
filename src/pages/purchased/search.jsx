import React from 'react';
import classname from 'classnames';
import { css } from 'emotion';
import { connect } from 'react-redux';
import Router from 'next/router';

import { loadSearchPage, changeSearchKeyword } from '../../services/purchased/search/actions';

import LNBTabBar, { TabMenuTypes } from '../base/LNB/LNBTabBar';
import SearchBar from '../../components/SearchBar';
import Paginator from '../../components/Paginator';
import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook';
import IconButton from '../../components/IconButton';
import EditingBar from '../../components/EditingBar';

import Responsive from '../base/Responsive';

import { toFlatten } from '../../utils/array';
import { makeURI } from '../../utils/uri';
import { PAGE_COUNT } from '../../constants/page';
import { URLMap } from '../../constants/urls';
import { getSearchPageInfo, getSearchItemsByPage } from '../../services/purchased/search/selectors';
import { getBooks } from '../../services/book/selectors';

const styles = {
  Main: css({
    position: 'relative',
  }),
  SearchToolBarWrapper: css({
    height: 46,
    backgroundColor: '#f3f4f5',
    boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
    boxSizing: 'border-box',
    borderBottom: '1px solid #d1d5d9',
  }),
  SearchToolBar: css({
    display: 'flex',
  }),
  SearchToolBarSearchBarWrapper: css({
    padding: '8px 0',
    height: 30,
    flex: 1,
    maxWidth: 600,
  }),
  SearchToolBarSearchBarWrapperActive: css({
    maxWidth: 'initial',
  }),
  SearchToolBarToolsWrapper: css({
    height: 30,
    padding: '8px 2px 8px 18px',
    marginLeft: 'auto',
  }),
  SearchToolBarIcon: css({
    margin: '3px 0',
    width: 24,
    height: 24,
    marginRight: 16,
    '&:last-of-type': {
      marginRight: 0,
    },
    '.RSGIcon': {
      width: 24,
      height: 24,
    },
  }),
};

class Search extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadSearchPage());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      hideTools: false,
    };

    this.toggleEditingMode = this.toggleEditingMode.bind(this);
    this.handleOnSubmitSearchBar = this.handleOnSubmitSearchBar.bind(this);
    this.handleOnFocusSearchBar = this.handleOnFocusSearchBar.bind(this);
    this.handleOnBlurSearchBar = this.handleOnBlurSearchBar.bind(this);
  }

  toggleEditingMode() {
    const { isEditing } = this.state;

    if (isEditing === true) {
      // 현재 Editing 모드면 나가면서 선택해둔 것들 클리어
    }

    this.setState({ isEditing: !isEditing });
  }

  handleOnSubmitSearchBar(value) {
    const { href, as } = URLMap.search;
    Router.push(makeURI(href, { keyword: value }), makeURI(as, { keyword: value }));
  }

  handleOnFocusSearchBar() {
    this.setState({
      hideTools: true,
    });
  }

  handleOnBlurSearchBar() {
    this.setState({
      hideTools: false,
    });
  }

  renderToolBar() {
    const { isEditing, hideTools } = this.state;
    const {
      pageInfo: { keyword },
    } = this.props;

    if (isEditing) return <EditingBar totalSelectedCount={0} onClickSuccessButton={this.toggleEditingMode} />;

    return (
      <div className={styles.SearchToolBarWrapper}>
        <Responsive className={styles.SearchToolBar}>
          <div className={classname(styles.SearchToolBarSearchBarWrapper, hideTools && styles.SearchToolBarSearchBarWrapperActive)}>
            <SearchBar
              keyword={keyword}
              onSubmit={this.handleOnSubmitSearchBar}
              onFocus={this.handleOnFocusSearchBar}
              onBlur={this.handleOnBlurSearchBar}
            />
          </div>
          {hideTools ? null : (
            <div className={styles.SearchToolBarToolsWrapper}>
              <IconButton icon="check_3" a11y="편집" className={styles.SearchToolBarIcon} onClick={this.toggleEditingMode} />
            </div>
          )}
        </Responsive>
      </div>
    );
  }

  renderBooks() {
    const { items, books } = this.props;
    return (
      <BookList>
        {items.map(item => (
          <LibraryBook key={item.b_id} item={item} book={books[item.b_id]} />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages, keyword },
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        pathname="/purchased/search"
        query={{ keyword }}
      />
    );
  }

  render() {
    return (
      <>
        <LNBTabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        {this.renderToolBar()}
        <main>
          <Responsive>
            {this.renderBooks()}
            {this.renderPaginator()}
          </Responsive>
        </main>
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getSearchPageInfo(state);
  const items = getSearchItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));

  return {
    pageInfo,
    items,
    books,
  };
};
const mapDispatchToProps = {
  changeSearchKeyword,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
