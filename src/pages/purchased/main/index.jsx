/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';
import BookDownLoader from '../../../components/BookDownLoader';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SearchBar from '../../../components/SearchBar';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import { ListInstructions } from '../../../constants/listInstructions';
import { OrderOptions } from '../../../constants/orderOptions';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import { getUnits } from '../../../services/book/selectors';
import { getRecentlyUpdatedData } from '../../../services/purchased/common/selectors';
import { downloadSelectedBooks, hideSelectedBooks, loadItems, selectAllBooks } from '../../../services/purchased/main/actions';
import {
  getBooksByPage,
  getFilter,
  getFilterOptions,
  getIsFetchingBooks,
  getItemsByPage,
  getLastBookIdsByPage,
  getOrder,
  getPage,
  getTotalPages,
  getUnitIdsByPage,
} from '../../../services/purchased/main/selectors';
import { clearSelectedBooks } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import BookOutline from '../../../svgs/BookOutline.svg';
import { makeLinkProps } from '../../../utils/uri';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';

class Main extends React.PureComponent {
  static async getInitialProps({ query, req, store }) {
    const isServer = Boolean(req);

    const currentPage = parseInt(query.page, 10) || 1;
    const { order_type: orderType = OrderOptions.DEFAULT.orderType, order_by: orderBy = OrderOptions.DEFAULT.orderBy } = query;
    const categoryFilter = parseInt(query.filter, 10) || null;

    const params = { currentPage, orderType, orderBy, categoryFilter };
    await store.dispatch(clearSelectedBooks());
    await store.dispatch(loadItems(params, isServer));
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
      isSelectedAllBooks,
      onClickSelectAllBooks: dispatchSelectAllBooks,
      onClickUnselectAllBooks: dispatchClearSelectedBooks,
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
    const { orderType, orderBy, categoryFilter: filter, filterOptions } = this.props;
    const order = OrderOptions.toKey(orderType, orderBy);
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

  linkBuilder = libraryBookData => {
    const { orderType, orderBy } = this.props; // eslint-disable-line react/no-this-in-sfc
    const order = OrderOptions.toKey(orderType, orderBy);

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

  renderBooks() {
    if (this.props.listInstruction === ListInstructions.SKELETON) {
      return <SkeletonBooks viewType={this.props.viewType} />;
    }

    const { isEditing: isSelectMode } = this.state;
    const { items: libraryBookDTO, books: platformBookDTO, units, recentlyUpdatedMap, viewType } = this.props;

    return (
      <>
        <Books
          {...{
            libraryBookDTO,
            platformBookDTO,
            units,
            isSelectMode,
            viewType,
            linkBuilder: this.linkBuilder,
            recentlyUpdatedMap,
          }}
        />
        {this.renderPaginator()}
      </>
    );
  }

  getEmptyMessage() {
    const { orderType, orderBy } = this.props;
    const order = OrderOptions.toKey(orderType, orderBy);

    if (OrderOptions.EXPIRE_DATE.key === order) {
      return '대여 중인 도서가 없습니다.';
    }
    if (OrderOptions.EXPIRED_BOOKS_ONLY.key === order) {
      return '만료된 도서가 없습니다.';
    }

    return '구매/대여하신 책이 없습니다.';
  }

  renderMain() {
    const { listInstruction } = this.props;

    if (listInstruction === ListInstructions.EMPTY) {
      return <Empty IconComponent={BookOutline} message={this.getEmptyMessage()} />;
    }
    return <ResponsiveBooks>{this.renderBooks()}</ResponsiveBooks>;
  }

  renderPaginator() {
    const { currentPage, orderType, orderBy, categoryFilter: filter, totalPages } = this.props;

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

  dispatchLoadItems = () => {
    const { currentPage, orderType, orderBy, categoryFilter, dispatchLoadItems } = this.props;
    return dispatchLoadItems({ currentPage, orderType, orderBy, categoryFilter });
  };

  render() {
    const { isEditing } = this.state;
    const { isError } = this.props;

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
          <main>{isError ? <BookError onClickRefreshButton={this.dispatchLoadItems} /> : this.renderMain()}</main>
        </Editable>
        <Footer />
        <BookDownLoader />
      </>
    );
  }
}

const mapStateToProps = state => {
  const currentPage = getPage(state);
  const order = getOrder(state);
  const { orderType, orderBy } = OrderOptions.parse(order);
  const categoryFilter = getFilter(state);
  const totalPages = getTotalPages(state);
  const filterOptions = getFilterOptions(state);
  const items = getItemsByPage(state);
  const books = getBooksByPage(state);
  const unitIds = getUnitIdsByPage(state);
  const units = getUnits(state, unitIds);
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);
  const lastBookIds = getLastBookIdsByPage(state);
  const recentlyUpdatedMap = getRecentlyUpdatedData(state, lastBookIds);

  let listInstruction;
  if (items.length !== 0) {
    listInstruction = ListInstructions.SHOW;
  } else if (isFetchingBooks) {
    listInstruction = ListInstructions.SKELETON;
  } else {
    listInstruction = ListInstructions.EMPTY;
  }
  return {
    currentPage,
    orderType,
    orderBy,
    categoryFilter,
    totalPages,
    filterOptions,
    items,
    books,
    units,
    recentlyUpdatedMap,
    totalSelectedCount,
    listInstruction,
    viewType: state.ui.viewType,
    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
