/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';
import { Books } from '../../../components/Books';
import BookDownLoader from '../../../components/BookDownLoader';
import Editable from '../../../components/Editable';
import EmptyBookList from '../../../components/EmptyBookList';
import { BookError } from '../../../components/Error';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SearchBar from '../../../components/SearchBar';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import Toast from '../../../components/Toast';
import { OrderOptions } from '../../../constants/orderOptions';
import { URLMap } from '../../../constants/urls';
import { getBooks } from '../../../services/book/selectors';
import {
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  selectAllBooks,
  toggleSelectBook,
} from '../../../services/purchased/main/actions';
import {
  getFilterOptions,
  getIsFetchingBooks,
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
} from '../../../services/purchased/main/selectors';
import { Duration, ToastStyle } from '../../../services/toast/constants';
import BookOutline from '../../../svgs/BookOutline.svg';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';

class Main extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(clearSelectedBooks());
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
      pageInfo: { order, orderType, orderBy, filter },
      filterOptions,
    } = this.props;
    const orderOptions = OrderOptions.toMainList();

    const searchBarProps = {
      filter,
      filterOptions,
      order,
      orderOptions,
      orderBy,
      orderType,
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
      pageInfo: { order, orderType, orderBy },
    } = this.props;

    const onSelectedChange = dispatchToggleSelectBook;
    const linkBuilder = () => libraryBookData => {
      const query = {};
      if (OrderOptions.EXPIRE_DATE.key === order || OrderOptions.EXPIRED_BOOKS_ONLY.key === order) {
        query.orderType = orderType;
        query.orderBy = orderBy;
      }

      const linkProps = makeLinkProps(
        {
          pathname: URLMap.mainUnit.href,
          query: { unitId: libraryBookData.unit_id },
        },
        URLMap.mainUnit.as({ unitId: libraryBookData.unit_id }),
        query,
      );

      return (
        <Link prefetch {...linkProps}>
          <a>더보기</a>
        </Link>
      );
    };

    const showSkeleton = isFetchingBooks && libraryBookDTO.length === 0;

    return showSkeleton ? (
      <SkeletonBooks viewType={viewType} />
    ) : (
      <>
        <Books
          {...{
            libraryBookDTO,
            platformBookDTO,
            selectedBooks,
            isSelectMode,
            onSelectedChange,
            viewType,
            linkBuilder: linkBuilder(),
          }}
        />
        {this.renderPaginator()}
      </>
    );
  }

  getEmptyBookListMessage() {
    const {
      pageInfo: { order },
    } = this.props;

    if (OrderOptions.EXPIRE_DATE.key === order) {
      return '대여 중인 도서가 없습니다.';
    }
    if (OrderOptions.EXPIRED_BOOKS_ONLY.key === order) {
      return '만료된 도서가 없습니다.';
    }

    return '구매/대여하신 책이 없습니다.';
  }

  renderMain() {
    const { items, isFetchingBooks } = this.props;

    if (!isFetchingBooks && items.length === 0) {
      return <EmptyBookList IconComponent={BookOutline} message={this.getEmptyBookListMessage()} />;
    }

    return <ResponsiveBooks>{this.renderBooks()}</ResponsiveBooks>;
  }

  renderPaginator() {
    const {
      pageInfo: { orderType, orderBy, filter, currentPage, totalPages },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={URLMap.main.href}
        as={URLMap.main.as}
        query={{ orderType, orderBy, filter }}
      />
    );
  }

  render() {
    const { isEditing } = this.state;
    const { isError, dispatchLoadItems } = this.props;

    return (
      <>
        <Head>
          <title>모든 책 - 내 서재</title>
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
        <Footer />
        <BookDownLoader />
        <Toast
          name="NEW_LIBRARY"
          expires={new Date(2019, 3, 25)}
          message="새로운 구매 목록인 내 서재를 이용해보세요."
          linkName="변경 사항 안내 바로가기"
          outLink="https://help.ridibooks.com/hc/ko/articles/360019333294"
          duration={Duration.VERY_LONG}
          toastStyle={ToastStyle.BLUE}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const filterOptions = getFilterOptions(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const selectedBooks = getSelectedBooks(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  return {
    pageInfo,
    filterOptions,
    items,
    books,
    selectedBooks,
    isFetchingBooks,
    viewType: state.ui.viewType,
    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchToggleSelectBook: toggleSelectBook,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
