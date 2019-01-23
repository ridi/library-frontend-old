/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import BookList from '../../../components/BookList';
import EmptyBookList from '../../../components/EmptyBookList';
import LibraryBook from '../../../components/LibraryBook';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SkeletonBookList from '../../../components/Skeleton/SkeletonBookList';
import { URLMap } from '../../../constants/urls';
import { getBooks } from '../../../services/book/selectors';
import {
  changeSearchKeyword,
  selectAllBooks,
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  toggleSelectBook,
} from '../../../services/purchased/search/actions';
import { getIsFetchingBooks, getItemsByPage, getSearchPageInfo, getSelectedBooks } from '../../../services/purchased/search/selectors';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps, makeURI } from '../../../utils/uri';
import SearchBar from '../../../components/SearchBar';
import Editable from '../../../components/Editable';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import Responsive from '../../base/Responsive';

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

  makeEditingBarProps() {
    const { items, selectedBooks, dispatchSelectAllBooks, dispatchClearSelectedBooks } = this.props;
    const totalSelectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = totalSelectedCount === items.length;

    return {
      totalSelectedCount,
      isSelectedAllBooks,
      onClickSelectAllBooks: dispatchSelectAllBooks,
      onClickUnselectAllBooks: dispatchClearSelectedBooks,
      onClickSuccessButton: this.toggleEditingMode,
    };
  }

  makeActionBarProps() {
    const { selectedBooks } = this.props;
    const disable = Object.keys(selectedBooks).length === 0;

    return {
      buttonsProps: [
        {
          name: '선택 숨기기',
          onClick: this.handleOnClickHide,
          disable,
        },
        {
          name: '선택 다운로드',
          onClick: this.handleOnClickDownload,
          disable,
        },
      ],
    };
  }

  renderSearchBar() {
    const { hideTools } = this.state;
    const {
      pageInfo: { keyword },
    } = this.props;

    const searchBarProps = {
      hideTools,
      keyword,
      handleOnSubmitSearchBar: this.handleOnSubmitSearchBar,
      handleOnFocusSearchBar: this.handleOnFocusSearchBar,
      handleOnBlurSearchBar: this.handleOnBlurSearchBar,
      edit: true,
      toggleEditingMode: this.toggleEditingMode,
    };

    return <SearchBar {...searchBarProps} />;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const {
      items,
      books,
      selectedBooks,
      dispatchToggleSelectBook,
      isFetchingBooks,
      pageInfo: { keyword },
    } = this.props;
    const showSkeleton = isFetchingBooks && items.length === 0;

    if (showSkeleton) {
      return (
        <Responsive>
          <SkeletonBookList />
        </Responsive>
      );
    }

    if (items.length === 0) {
      return <EmptyBookList icon="search" message={`'${keyword}'에 대한 검색 결과가 없습니다.`} />;
    }

    return (
      <Responsive>
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
        {this.renderPaginator()}
      </Responsive>
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

  render() {
    const { isEditing } = this.state;
    const {
      pageInfo: { keyword },
    } = this.props;

    return (
      <>
        <Head>
          <title>{`'${keyword}'`} 검색 결과 - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        <Editable
          isEditing={isEditing}
          nonEditBar={this.renderSearchBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.makeActionBarProps()}
        >
          <main>{this.renderBooks()}</main>
        </Editable>
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
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchToggleSelectBook: toggleSelectBook,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
