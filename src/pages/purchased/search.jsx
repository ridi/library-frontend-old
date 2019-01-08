import Head from 'next/head';

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
import Router from 'next/router';
import EmptyBookList from '../../components/EmptyBookList';
import ResponsivePaginator from '../../components/ResponsivePaginator';

import {
  loadItems,
  changeSearchKeyword,
  clearSelectedBooks,
  toggleSelectBook,
  hideSelectedBooks,
  downloadSelectedBooks,
} from '../../services/purchased/search/actions';

import LNBTabBar, { TabMenuTypes } from '../base/LNB/LNBTabBar';
import SearchBar from '../../components/SearchBar';
import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook';
import IconButton from '../../components/IconButton';
import EditingBar from '../../components/EditingBar';
import { BottomActionBar, BottomActionButton } from '../../components/BottomActionBar';
import SkeletonBookList from '../../components/Skeleton/SkeletonBookList';

import Responsive from '../base/Responsive';

import { toFlatten } from '../../utils/array';
import { makeLinkProps, makeURI } from '../../utils/uri';
import { URLMap } from '../../constants/urls';
import { getSearchPageInfo, getItemsByPage, getSelectedBooks, getIsFetchingBooks } from '../../services/purchased/search/selectors';
import { getBooks } from '../../services/book/selectors';

const styles = {
  searchFetchingBooks: css({
    backgroundColor: 'white',
  }),
  searchToolBarWrapper: css({
    height: 46,
    backgroundColor: '#f3f4f5',
    boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
    boxSizing: 'border-box',
    borderBottom: '1px solid #d1d5d9',
  }),
  searchToolBar: css({
    display: 'flex',
  }),
  searchToolBarSearchBarWrapper: css({
    padding: '8px 0',
    height: 30,
    flex: 1,
    maxWidth: 600,
  }),
  searchToolBarSearchBarWrapperActive: css({
    maxWidth: 'initial',
  }),
  searchToolBarToolsWrapper: css({
    height: 30,
    padding: '8px 2px 8px 18px',
    marginLeft: 'auto',
  }),
  searchToolBarIcon: css({
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
  ButtonActionLeft: css({
    float: 'left',
  }),
  ButtonActionRight: css({
    float: 'right',
  }),
};

class Search extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      hideTools: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    const { dispatchClearSelectedBooks } = this.props;

    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    this.setState({ isEditing: !isEditing });
  };

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

  handleOnClickHide = () => {
    const { dispatchHideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDownload = () => {
    const { dispatchDownloadSelectedBooks, dispatchClearSelectedBooks } = this.props;
    dispatchDownloadSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  renderToolBar() {
    const { isEditing, hideTools } = this.state;
    const {
      pageInfo: { keyword },
      items,
      selectedBooks,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
    } = this.props;

    if (isEditing) {
      const selectedCount = Object.keys(selectedBooks).length;
      const isSelectedAllBooks = selectedCount === items.length;
      return (
        <EditingBar
          totalSelectedCount={selectedCount}
          isSelectedAllBooks={isSelectedAllBooks}
          onClickSelectAllBooks={dispatchSelectAllBooks}
          onClickUnselectAllBooks={dispatchClearSelectedBooks}
          onClickSuccessButton={this.toggleEditingMode}
        />
      );
    }

    return (
      <div css={styles.searchToolBarWrapper}>
        <Responsive css={styles.searchToolBar}>
          <div css={[styles.searchToolBarSearchBarWrapper, hideTools && styles.searchToolBarSearchBarWrapperActive]}>
            <SearchBar
              keyword={keyword}
              onSubmit={this.handleOnSubmitSearchBar}
              onFocus={this.handleOnFocusSearchBar}
              onBlur={this.handleOnBlurSearchBar}
            />
          </div>
          {hideTools ? null : (
            <div css={styles.searchToolBarToolsWrapper}>
              <IconButton icon="check_3" a11y="편집" css={styles.searchToolBarIcon} onClick={this.toggleEditingMode} />
            </div>
          )}
        </Responsive>
      </div>
    );
  }

  renderBooks() {
    const { isEditing } = this.state;
    const {
      isFetchingBooks,
      items,
      books,
      selectedBooks,
      dispatchToggleSelectBook,
      pageInfo: { keyword },
    } = this.props;

    if (items.length === 0) {
      if (isFetchingBooks) {
        return <SkeletonBookList />;
      }
      return <EmptyBookList message={`'${keyword}'에 대한 검색 결과가 없습니다.`} />;
    }

    return (
      <BookList>
        {items.map(item => (
          <LibraryBook
            key={item.b_id}
            item={item}
            book={books[item.b_id]}
            isEditing={isEditing}
            checked={!!selectedBooks[item.b_id]}
            onChangeCheckbox={() => dispatchToggleSelectBook(item.b_id)}
            {...makeLinkProps({ pathname: URLMap.searchUnit.href, query: { unitId: item.unit_id } }, URLMap.searchUnit.as(item.unit_id), {
              keyword,
            })}
          />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages, keyword },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={URLMap.search.href}
        as={URLMap.search.as}
        query={{ keyword }}
      />
    );
  }

  renderBottomActionBar() {
    const { isEditing } = this.state;
    const { selectedBooks } = this.props;
    if (!isEditing) {
      return null;
    }

    const disable = Object.keys(selectedBooks).length === 0;
    return (
      <BottomActionBar>
        <BottomActionButton name="선택 숨기기" css={styles.ButtonActionLeft} onClick={this.handleOnClickHide} disable={disable} />
        <BottomActionButton name="선택 다운로드" css={styles.ButtonActionRight} onClick={this.handleOnClickDownload} disable={disable} />
      </BottomActionBar>
    );
  }

  render() {
    const {
      isFetchingBooks,
      pageInfo: { keyword },
    } = this.props;

    return (
      <>
        <Head>
          <title>'{keyword}' 검색 결과 - 내 서재</title>
        </Head>
        <LNBTabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        {this.renderToolBar()}
        <main css={isFetchingBooks && styles.searchFetchingBooks}>
          <Responsive>
            {this.renderBooks()}
            {this.renderPaginator()}
          </Responsive>
        </main>
        {this.renderBottomActionBar()}
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getSearchPageInfo(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const selectedBooks = getSelectedBooks(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  return {
    pageInfo,
    items,
    books,
    selectedBooks,
    isFetchingBooks,
  };
};
const mapDispatchToProps = {
  dispatchChangeSearchKeyword: changeSearchKeyword,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchToggleSelectBook: toggleSelectBook,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
