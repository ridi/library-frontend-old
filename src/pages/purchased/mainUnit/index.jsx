/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import BookDownLoader from '../../../components/BookDownLoader';
import UnitDetailView from '../../../components/UnitDetailView';
import { UnitType } from '../../../constants/unitType';
import { URLMap, toPageType, PageType } from '../../../constants/urls';
import { getBooks, getUnit, getBookStarRating, getBookDescription } from '../../../services/book/selectors';
import { getPageInfo as getMainPageInfo } from '../../../services/purchased/main/selectors';
import { getPageInfo as getSerialPreferencePageInfo } from '../../../services/serialPreference/selectors';
import {
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  selectAllBooks,
  setUnitId,
  toggleSelectBook,
} from '../../../services/purchased/mainUnit/actions';
import {
  getIsFetchingBook,
  getPageInfo,
  getSelectedBooks,
  getTotalCount,
  getUnitId,
  getItemsByPage,
  getPrimaryItem,
} from '../../../services/purchased/mainUnit/selectors';
import { toFlatten } from '../../../utils/array';
import Responsive from '../../base/Responsive';
import TitleBar from '../../../components/TitleBar';
import { OrderOptions } from '../../../constants/orderOptions';
import SeriesView from '../../../components/SeriesView';
import { BookError } from '../../../components/Error';
import { getPrimaryBookId } from '../../../services/purchased/common/selectors';
import { getLocation } from '../../../services/router/selectors';

class MainUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(clearSelectedBooks());
    await store.dispatch(loadItems());
  }

  handleOnClickHide = () => {
    const { dispatchHideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchHideSelectedBooks();
    dispatchClearSelectedBooks();
  };

  handleOnClickDownload = () => {
    const { dispatchDownloadSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDownloadSelectedBooks();
    dispatchClearSelectedBooks();
  };

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

  renderTitleBar() {
    const {
      unit,
      totalCount,
      pageInfo: { order },
      backPageProps,
    } = this.props;

    const usePurchasedTotalCount = [OrderOptions.UNIT_ORDER_DESC.key, OrderOptions.UNIT_ORDER_ASC.key].includes(order);

    const extraTitleBarProps = unit
      ? {
          title: unit.title,
          showCount:
            !UnitType.isBook(unit.type) && (usePurchasedTotalCount ? totalCount.purchasedTotalCount > 0 : totalCount.itemTotalCount > 0),
          totalCount: usePurchasedTotalCount ? totalCount.purchasedTotalCount : totalCount.itemTotalCount,
        }
      : {};

    return <TitleBar {...backPageProps} {...extraTitleBarProps} />;
  }

  renderDetailView() {
    const { unit, primaryBookId, primaryItem, items, books, bookDescription, bookStarRating } = this.props;

    return (
      <UnitDetailView
        unit={unit}
        primaryBookId={primaryBookId}
        primaryItem={primaryItem}
        items={items}
        books={books}
        bookDescription={bookDescription}
        bookStarRating={bookStarRating}
        downloadable
        readableLatest
      />
    );
  }

  renderSeriesView() {
    const {
      unit,
      primaryBookId,
      pageInfo: { order },
      pageProps,
      isFetchingBook,
      items,
      books,
      selectedBooks,
      dispatchToggleSelectBook,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
    } = this.props;
    if (!books[primaryBookId]) {
      return null;
    }

    const bookUnitOfCount = books[primaryBookId].series ? books[primaryBookId].series.property.unit : null;
    const orderOptions = UnitType.isSeries(unit.type)
      ? OrderOptions.toSeriesList(bookUnitOfCount)
      : OrderOptions.toShelfList(bookUnitOfCount);

    return (
      <SeriesView
        pageProps={pageProps}
        actionBarProps={this.makeActionBarProps()}
        currentOrder={order}
        orderOptions={orderOptions}
        isFetching={isFetchingBook}
        items={items}
        books={books}
        unit={unit}
        linkWebviewer
        selectedBooks={selectedBooks}
        onSelectedChange={dispatchToggleSelectBook}
        onClickSelectAllBooks={dispatchSelectAllBooks}
        onClickUnselectAllBooks={dispatchClearSelectedBooks}
      />
    );
  }

  renderMain() {
    const { unit } = this.props;
    return (
      <>
        <Responsive>{this.renderDetailView()}</Responsive>
        {unit && UnitType.isBook(unit.type) ? null : this.renderSeriesView()}
      </>
    );
  }

  render() {
    const { unit, isError, dispatchLoadItems } = this.props;

    return (
      <>
        <Head>
          <title>{unit.title ? `${unit.title} - ` : ''}내 서재</title>
        </Head>
        {this.renderTitleBar()}
        <main>{isError ? <BookError onClickRefreshButton={() => dispatchLoadItems()} /> : this.renderMain()}</main>
        <BookDownLoader />
      </>
    );
  }
}

const mapStateToProps = state => {
  const unitId = getUnitId(state);
  const unit = getUnit(state, unitId);
  const primaryBookId = getPrimaryBookId(state, unitId);
  const primaryItem = getPrimaryItem(state);
  const items = getItemsByPage(state);

  const books = getBooks(state, [...toFlatten(items, 'b_id'), primaryBookId]);
  const bookDescription = getBookDescription(state, primaryBookId);
  const bookStarRating = getBookStarRating(state, primaryBookId);

  const totalCount = getTotalCount(state);

  const selectedBooks = getSelectedBooks(state);
  const isFetchingBook = getIsFetchingBook(state);

  const pageInfo = getPageInfo(state);
  const mainPageInfo = getMainPageInfo(state);
  const serialPrefPageInfo = getSerialPreferencePageInfo(state);

  const location = getLocation(state);

  return {
    items,
    unit,
    primaryBookId,
    primaryItem,
    books,
    bookDescription,
    bookStarRating,
    totalCount,
    selectedBooks,
    isFetchingBook,

    pageInfo,
    mainPageInfo,
    serialPrefPageInfo,
    location,

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

const mergeProps = (state, actions, props) => {
  const {
    unitId,
    location: { pathname },
    pageInfo: { currentPage, totalPages, orderType, orderBy },
    mainPageInfo,
    serialPrefPageInfo,
  } = state;
  const pageType = toPageType(pathname);
  const pageProps = {
    currentPage,
    totalPages,
    href: { pathname: URLMap[pageType].href, query: { unitId } },
    as: URLMap[pageType].as({ unitId }),
    query: { orderType: orderType, orderBy: orderBy },
  };

  // TODO: Unit파일 통합하면 외부에선 UnitPageTemplate에 pageProps, backPageProps, actions등을 주입하는 식으로 변경
  // 파일을 각각 유지하더라도 아래 로직은 분리해서 복잡하지 않게 유지
  let backPageProps;
  if (pageType === PageType.MAIN_UNIT) {
    backPageProps = {
      href: URLMap[PageType.MAIN].href,
      as: URLMap[PageType.MAIN].as,
      query: {
        page: mainPageInfo.currentPage,
        orderType: mainPageInfo.orderType,
        orderBy: mainPageInfo.orderBy,
        filter: mainPageInfo.filter,
      },
    };
  } else if (pageType === PageType.SERIAL_PREFERENCE_UNIT) {
    backPageProps = {
      href: URLMap[PageType.SERIAL_PREFERENCE].href,
      as: URLMap[PageType.SERIAL_PREFERENCE].as,
      query: { page: serialPrefPageInfo.currentPage },
    };
  }

  return {
    ...state,
    ...actions,
    ...props,
    pageProps,
    backPageProps,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(MainUnit);
