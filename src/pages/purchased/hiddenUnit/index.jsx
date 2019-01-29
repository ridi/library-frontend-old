/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import SkeletonUnitDetailView from '../../../components/Skeleton/SkeletonUnitDetailView';
import UnitDetailView from '../../../components/UnitDetailView';
import { URLMap } from '../../../constants/urls';
import { getBookDescriptions, getBooks, getUnit } from '../../../services/book/selectors';
import { getPageInfo as getHiddenPageInfo } from '../../../services/purchased/hidden/selectors';
import {
  clearSelectedBooks,
  deleteSelectedBooks,
  loadItems,
  selectAllBooks,
  setUnitId,
  toggleSelectBook,
  unhideSelectedBooks,
} from '../../../services/purchased/hiddenUnit/actions';
import {
  getIsFetchingBook,
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
  getTotalCount,
  getUnitId,
  getPrimaryItem,
} from '../../../services/purchased/hiddenUnit/selectors';
import { toFlatten } from '../../../utils/array';
import Responsive from '../../base/Responsive';
import TitleBar from '../../../components/TitleBar';
import { ButtonType } from '../../../components/ActionBar/constants';
import { UnitType } from '../../../constants/unitType';
import SeriesView from '../../../components/SeriesView';

class HiddenUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(loadItems());
  }

  handleOnClickUnhide = () => {
    const { dispatchUnhideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchUnhideSelectedBooks();
    dispatchClearSelectedBooks();
  };

  handleOnClickDelete = () => {
    const { dispatchDeleteSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDeleteSelectedBooks();
    dispatchClearSelectedBooks();
  };

  makeActionBarProps() {
    const { selectedBooks } = this.props;
    const disable = Object.keys(selectedBooks).length === 0;

    return {
      buttonProps: [
        {
          name: '선택 영구 삭제',
          type: ButtonType.DANGER,
          onClick: this.handleOnClickDelete,
          disable,
        },
        {
          name: '선택 숨김 해제',
          onClick: this.handleOnClickUnhide,
          disable,
        },
      ],
    };
  }

  renderTitleBar() {
    const {
      unit,
      totalCount,
      hiddenPageInfo: { currentPage: page },
    } = this.props;

    const titleBarProps = {
      title: unit.title,
      showCount: !UnitType.isBook(unit.type),
      totalCount: totalCount.itemTotalCount,
      href: URLMap.hidden.href,
      as: URLMap.hidden.as,
      query: { page },
    };

    return <TitleBar {...titleBarProps} />;
  }

  renderDetailView() {
    const { unit, primaryItem, books, bookDescriptions } = this.props;
    if (!primaryItem) {
      return <SkeletonUnitDetailView />;
    }

    const primaryBook = books[primaryItem.b_id];
    const primaryBookDescription = bookDescriptions[primaryItem.b_id];
    if (!primaryBook || !primaryBookDescription) {
      return <SkeletonUnitDetailView />;
    }

    return <UnitDetailView unit={unit} primaryItem={primaryItem} book={primaryBook} bookDescription={primaryBookDescription} />;
  }

  renderSeriesView() {
    const {
      primaryItem,
      pageInfo: { currentPage, totalPages, unitId },
      isFetchingBook,
      items,
      books,
      selectedBooks,
      dispatchToggleSelectBook,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
    } = this.props;

    if (!primaryItem) {
      return null;
    }

    return (
      <SeriesView
        pageProps={{
          currentPage,
          totalPages,
          href: { pathname: URLMap.hiddenUnit.href, query: { unitId } },
          as: URLMap.hiddenUnit.as(unitId),
        }}
        actionBarProps={this.makeActionBarProps()}
        emptyProps={{ icon: 'book_5', message: '숨긴 도서가 없습니다.' }}
        isFetching={isFetchingBook}
        items={items}
        books={books}
        selectedBooks={selectedBooks}
        onSelectedChange={dispatchToggleSelectBook}
        onClickSelectAllBooks={dispatchSelectAllBooks}
        onClickUnselectAllBooks={dispatchClearSelectedBooks}
      />
    );
  }

  render() {
    const { unit } = this.props;
    return (
      <>
        <Head>
          <title>{unit.title} - 내 서재</title>
        </Head>
        {this.renderTitleBar()}
        <main>
          <Responsive>{this.renderDetailView()}</Responsive>
          {UnitType.isBook(unit.type) ? null : this.renderSeriesView()}
        </main>
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

  const bookIds = toFlatten(items, 'b_id');
  if (primaryItem) {
    bookIds.push(primaryItem.b_id);
  }
  const books = getBooks(state, bookIds);
  const bookDescriptions = getBookDescriptions(state, bookIds);

  const totalCount = getTotalCount(state);
  const selectedBooks = getSelectedBooks(state);
  const isFetchingBook = getIsFetchingBook(state);

  const hiddenPageInfo = getHiddenPageInfo(state);
  return {
    pageInfo,
    items,
    unit,
    primaryItem,
    books,
    bookDescriptions,
    totalCount,
    selectedBooks,
    isFetchingBook,

    hiddenPageInfo,
  };
};

const mapDispatchToProps = {
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchToggleSelectBook: toggleSelectBook,
  dispatchUnhideSelectedBooks: unhideSelectedBooks,
  dispatchDeleteSelectedBooks: deleteSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HiddenUnit);
