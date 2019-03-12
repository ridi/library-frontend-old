/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import BookDownLoader from '../../../components/BookDownLoader';
import UnitDetailView from '../../../components/UnitDetailView';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import { getBooks, getUnit, getBookStarRating, getBookDescription } from '../../../services/book/selectors';
import { getPageInfo as getMainPageInfo } from '../../../services/purchased/main/selectors';
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
      mainPageInfo: { currentPage: page, orderType, orderBy, filter },
    } = this.props;

    const titleBarProps = {
      href: URLMap.main.href,
      as: URLMap.main.as,
      query: { page, orderType, orderBy, filter },
    };

    const extraTitleBarProps = unit
      ? {
          title: unit.title,
          showCount: !UnitType.isBook(unit.type) && totalCount.itemTotalCount > 0,
          totalCount: totalCount.itemTotalCount,
        }
      : {};

    return <TitleBar {...titleBarProps} {...extraTitleBarProps} />;
  }

  renderDetailView() {
    const { unit, primaryItem, items, books, bookDescription, bookStarRating } = this.props;

    return (
      <UnitDetailView
        unit={unit}
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
      primaryItem,
      pageInfo: { order, orderType, orderBy, currentPage, totalPages, unitId },
      isFetchingBook,
      items,
      books,
      selectedBooks,
      dispatchToggleSelectBook,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
    } = this.props;
    if (!primaryItem || !books[primaryItem.b_id]) {
      return null;
    }

    const bookUnitOfCount = primaryItem && books[primaryItem.b_id].series ? books[primaryItem.b_id].series.property.unit : null;
    const orderOptions = UnitType.isSeries(unit.type)
      ? OrderOptions.toSeriesList(bookUnitOfCount)
      : OrderOptions.toShelfList(bookUnitOfCount);

    console.log('renderSeriesView');
    console.log(items);
    console.log(books);
    return (
      <SeriesView
        pageProps={{
          currentPage,
          totalPages,
          href: { pathname: URLMap.mainUnit.href, query: { unitId } },
          as: URLMap.mainUnit.as({ unitId }),
          query: { orderType, orderBy },
        }}
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
  const pageInfo = getPageInfo(state);

  const unitId = getUnitId(state);
  const unit = getUnit(state, unitId);
  const primaryItem = getPrimaryItem(state);
  const items = getItemsByPage(state);

  const _bookIds = toFlatten(items, 'b_id');
  if (primaryItem) {
    _bookIds.push(primaryItem.b_id);
  }

  const books = getBooks(state, _bookIds);
  const bookDescription = primaryItem ? getBookDescription(state, primaryItem.b_id) : null;
  const bookStarRating = primaryItem ? getBookStarRating(state, primaryItem.b_id) : null;

  const totalCount = getTotalCount(state);
  const selectedBooks = getSelectedBooks(state);
  const isFetchingBook = getIsFetchingBook(state);

  const mainPageInfo = getMainPageInfo(state);

  return {
    pageInfo,
    items,
    unit,
    primaryItem,
    books,
    bookDescription,
    bookStarRating,
    totalCount,
    selectedBooks,
    isFetchingBook,

    mainPageInfo,

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
)(MainUnit);
