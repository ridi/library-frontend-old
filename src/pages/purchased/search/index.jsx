/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import EmptyBookList from '../../../components/EmptyBookList';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SearchBar from '../../../components/SearchBar';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import { URLMap } from '../../../constants/urls';
import ViewType from '../../../constants/viewType';
import { getBooks } from '../../../services/book/selectors';
import {
  changeSearchKeyword,
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  selectAllBooks,
  toggleSelectBook,
} from '../../../services/purchased/search/actions';
import { getIsFetchingBooks, getItemsByPage, getSearchPageInfo, getSelectedBooks } from '../../../services/purchased/search/selectors';
import SearchIcon from '../../../svgs/Search.svg';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import Responsive from '../../base/Responsive';
import { BookError } from '../../../components/Error';

class Search extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
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
      buttonProps: [
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
    const {
      pageInfo: { keyword },
    } = this.props;

    const searchBarProps = {
      keyword,
      toggleEditingMode: this.toggleEditingMode,
    };

    return <SearchBar {...searchBarProps} />;
  }

  renderBooks() {
    const { isEditing: isSelectMode } = this.state;
    const {
      items: libraryBookDTO,
      books: platformBookDTO,
      selectedBooks,
      dispatchToggleSelectBook,
      isFetchingBooks,
      viewType,
      pageInfo: { keyword },
    } = this.props;
    const onSelectedChange = dispatchToggleSelectBook;
    const showSkeleton = isFetchingBooks && libraryBookDTO.length === 0;

    if (showSkeleton) {
      return <SkeletonBooks viewType={viewType} />;
    }

    const linkBuilder = _keyword => libraryBookData => {
      const linkProps = makeLinkProps(
        {
          pathname: URLMap.searchUnit.href,
          query: { unitId: libraryBookData.unit_id },
        },
        URLMap.searchUnit.as({ unitId: libraryBookData.unit_id }),
        { keyword: _keyword },
      );

      return (
        <Link {...linkProps}>
          <a>더보기</a>
        </Link>
      );
    };

    return (
      <>
        <Books
          {...{
            libraryBookDTO,
            platformBookDTO,
            selectedBooks,
            isSelectMode,
            onSelectedChange,
            viewType,
            linkBuilder: linkBuilder(keyword),
          }}
        />
        {this.renderPaginator()}
      </>
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

  renderMain() {
    const {
      items,
      isFetchingBooks,
      pageInfo: { keyword },
    } = this.props;

    if (!isFetchingBooks && items.length === 0) {
      let message = `'${keyword}'에 대한 검색 결과가 없습니다.`;
      if (!keyword) {
        message = '검색어를 입력해주세요.';
      }

      return <EmptyBookList IconComponent={SearchIcon} message={message} />;
    }

    return <Responsive hasPadding={false}>{this.renderBooks()}</Responsive>;
  }

  render() {
    const { isEditing } = this.state;
    const {
      pageInfo: { keyword },
      isError,
      dispatchLoadItems,
    } = this.props;

    let title = `'${keyword}' 검색 결과 - 내 서재`;
    if (!keyword) {
      title = '검색 - 내 서재';
    }

    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        <Editable
          allowFixed
          isEditing={isEditing}
          nonEditBar={this.renderSearchBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.makeActionBarProps()}
        >
          <main>{isError ? <BookError onClickRefreshButton={() => dispatchLoadItems()} /> : this.renderMain()}</main>
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
    viewType: ViewType.LANDSCAPE,
    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchLoadItems: loadItems,
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
