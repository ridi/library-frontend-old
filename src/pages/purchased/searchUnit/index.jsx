/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import UnitDetailView from '../../../components/UnitDetailView';
import { URLMap } from '../../../constants/urls';
import { getBooks, getUnit, getBookStarRating, getBookDescription } from '../../../services/book/selectors';
import { getSearchPageInfo } from '../../../services/purchased/search/selectors';
import {
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  selectAllBooks,
  setUnitId,
  toggleSelectBook,
} from '../../../services/purchased/searchUnit/actions';
import {
  getIsFetchingBook,
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
  getTotalCount,
  getUnitId,
  getPrimaryItem,
} from '../../../services/purchased/searchUnit/selectors';
import { toFlatten } from '../../../utils/array';
import Responsive from '../../base/Responsive';
import { UnitType } from '../../../constants/unitType';
import TitleBar from '../../../components/TitleBar';
import { UnitOrderOptions } from '../../../constants/orderOptions';
import SeriesView from '../../../components/SeriesView';
import { BookError } from '../../../components/Error';

class searchUnit extends React.Component {
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
      pageInfo: { keyword },
      searchPageInfo: { currentPage: page },
    } = this.props;

    const titleBarProps = {
      href: URLMap.search.href,
      as: URLMap.search.as,
      query: { keyword, page },
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
    const orderOptions = UnitType.isSeries(unit.type) ? UnitOrderOptions.toSeriesList() : UnitOrderOptions.toShelfList();

    if (!primaryItem) {
      return null;
    }

    return (
      <SeriesView
        pageProps={{
          currentPage,
          totalPages,
          href: { pathname: URLMap.searchUnit.href, query: { unitId } },
          as: URLMap.searchUnit.as({ unitId }),
          query: { orderType, orderBy },
        }}
        actionBarProps={this.makeActionBarProps()}
        currentOrder={order}
        orderOptions={orderOptions}
        isFetching={isFetchingBook}
        items={items}
        books={books}
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
          <title>{unit ? `${unit.title} - ` : ''}내 서재</title>
        </Head>
        {this.renderTitleBar()}
        <main>{isError ? <BookError onClickRefreshButton={() => dispatchLoadItems()} /> : this.renderMain()}</main>
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

  const selectedBooks = getSelectedBooks(state);
  const totalCount = getTotalCount(state);

  const isFetchingBook = getIsFetchingBook(state);

  const searchPageInfo = getSearchPageInfo(state);
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

    searchPageInfo,
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
)(searchUnit);
