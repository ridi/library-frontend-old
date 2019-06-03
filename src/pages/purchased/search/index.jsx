/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';
import { ACTION_BAR_HEIGHT } from '../../../components/ActionBar/styles';
import BookDownLoader from '../../../components/BookDownLoader';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SearchBar from '../../../components/SearchBar';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import ViewType from '../../../constants/viewType';
import { getBooks, getUnits } from '../../../services/book/selectors';
import { getRecentlyUpdatedData } from '../../../services/purchased/common/selectors';
import {
  changeSearchKeyword,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  selectAllBooks,
} from '../../../services/purchased/search/actions';
import { getIsFetchingBooks, getItemsByPage, getSearchPageInfo } from '../../../services/purchased/search/selectors';
import { clearSelectedItems } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import SearchIcon from '../../../svgs/Search.svg';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';

const paddingForPagination = {
  paddingBottom: ACTION_BAR_HEIGHT,
};

class Search extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(clearSelectedItems());
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
    const { items, totalSelectedCount, dispatchSelectAllBooks, dispatchClearSelectedBooks } = this.props;
    const isSelectedAllBooks = totalSelectedCount === items.filter(item => !UnitType.isCollection(item.unit_type)).length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: dispatchSelectAllBooks,
      onClickUnselectAllItem: dispatchClearSelectedBooks,
      onClickSuccessButton: this.toggleEditingMode,
    };
  }

  makeActionBarProps() {
    const { totalSelectedCount } = this.props;
    const disable = totalSelectedCount === 0;

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

    return <SearchBar isSearchPage {...searchBarProps} />;
  }

  renderBooks() {
    const { isEditing: isSelectMode } = this.state;
    const {
      items: libraryBookDTO,
      books: platformBookDTO,
      units,
      recentlyUpdatedMap,
      isFetchingBooks,
      viewType,
      pageInfo: { keyword },
    } = this.props;
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
        <Link prefetch {...linkProps}>
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
            units,
            isSelectMode,
            viewType,
            linkBuilder: linkBuilder(keyword),
          }}
          recentlyUpdatedMap={recentlyUpdatedMap}
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

      return <Empty IconComponent={SearchIcon} iconWidth={38} message={message} />;
    }

    return (
      <div css={paddingForPagination}>
        <ResponsiveBooks>{this.renderBooks()}</ResponsiveBooks>
      </div>
    );
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
          <BookDownLoader />
        </Editable>
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getSearchPageInfo(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const units = getUnits(state, toFlatten(items, 'unit_id'));
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  const lastBookIds = toFlatten(Object.values(books), 'series.property.opened_last_volume_id', true);
  const recentlyUpdatedMap = getRecentlyUpdatedData(state, lastBookIds);

  return {
    pageInfo,
    items,
    books,
    units,
    recentlyUpdatedMap,
    totalSelectedCount,
    isFetchingBooks,
    viewType: ViewType.LANDSCAPE,
    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchLoadItems: loadItems,
  dispatchChangeSearchKeyword: changeSearchKeyword,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedItems,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
