/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import UnitDetailView from '../../../components/UnitDetailView';
import { URLMap } from '../../../constants/urls';
import { getBooks, getUnit, getBookStarRating, getBookDescription } from '../../../services/book/selectors';
import { getPageInfo as getHiddenPageInfo } from '../../../services/purchased/hidden/selectors';
import {
  deleteSelectedBooks,
  loadItems,
  selectAllBooks,
  setUnitId,
  unhideSelectedBooks,
} from '../../../services/purchased/hiddenUnit/actions';
import { clearSelectedItems } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import {
  getIsFetchingBook,
  getItemsByPage,
  getPageInfo,
  getTotalCount,
  getUnitId,
  getPrimaryItem,
} from '../../../services/purchased/hiddenUnit/selectors';
import { toFlatten } from '../../../utils/array';
import Responsive from '../../base/Responsive';
import TitleBar from '../../../components/TitleBar';
import { ButtonType } from '../../../components/ActionBar/constants';
import { UnitType } from '../../../constants/unitType';
import SeriesList from '../../../components/SeriesList';
import { BookError } from '../../../components/Error';
import { showConfirm } from '../../../services/confirm/actions';
import { getPrimaryBookId } from '../../../services/purchased/common/selectors';

class HiddenUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(clearSelectedItems());
    await store.dispatch(loadItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  handleOnClickUnhide = () => {
    const { dispatchUnhideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchUnhideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  deleteSelectedBooks = () => {
    const { dispatchDeleteSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDeleteSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDelete = () => {
    this.props.dispatchShowConfirm(
      '영구 삭제',
      <>
        내 서재에서 영구히 삭제되며 다시 구매해야 이용할 수 있습니다.
        <br />
        <br />
        그래도 삭제하시겠습니까?
      </>,
      '삭제',
      this.deleteSelectedBooks,
    );
  };

  handleEditingChange = isEditing => this.setState({ isEditing });

  makeActionBarProps() {
    const { isSelected } = this.props;
    const disable = !isSelected;

    return {
      buttonProps: [
        {
          name: '선택 영구 삭제',
          type: ButtonType.DANGER,
          onClick: this.handleOnClickDelete,
          disable,
        },
        {
          type: ButtonType.SPACER,
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
      href: URLMap.hidden.href,
      as: URLMap.hidden.as,
      query: { page },
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
      />
    );
  }

  renderSeriesList() {
    const {
      primaryBookId,
      pageInfo: { currentPage, totalPages, unitId },
      isFetchingBook,
      items,
      books,
      unit,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
    } = this.props;
    const { isEditing } = this.state;

    if (!books[primaryBookId]) {
      return null;
    }

    return (
      <SeriesList
        pageProps={{
          currentPage,
          totalPages,
          href: { pathname: URLMap.hiddenUnit.href, query: { unitId } },
          as: URLMap.hiddenUnit.as({ unitId }),
        }}
        actionBarProps={this.makeActionBarProps()}
        emptyProps={{ icon: 'book_5', message: '숨긴 도서가 없습니다.' }}
        isFetching={isFetchingBook}
        isEditing={isEditing}
        onEditingChange={this.handleEditingChange}
        items={items}
        books={books}
        unit={unit}
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
        {unit && UnitType.isBook(unit.type) ? null : this.renderSeriesList()}
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
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);

  const unitId = getUnitId(state);
  const unit = getUnit(state, unitId);
  const primaryBookId = getPrimaryBookId(state, unitId);
  const primaryItem = getPrimaryItem(state);
  const items = getItemsByPage(state);

  const books = getBooks(state, [...toFlatten(items, 'b_id'), primaryBookId]);
  const bookDescription = getBookDescription(state, primaryBookId);
  const bookStarRating = getBookStarRating(state, primaryBookId);

  const totalCount = getTotalCount(state);
  const isSelected = getTotalSelectedCount(state) !== 0;
  const isFetchingBook = getIsFetchingBook(state);

  const hiddenPageInfo = getHiddenPageInfo(state);

  return {
    pageInfo,
    items,
    unit,
    primaryBookId,
    primaryItem,
    books,
    bookDescription,
    bookStarRating,
    totalCount,
    isSelected,
    isFetchingBook,

    hiddenPageInfo,

    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchShowConfirm: showConfirm,
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedItems,
  dispatchUnhideSelectedBooks: unhideSelectedBooks,
  dispatchDeleteSelectedBooks: deleteSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HiddenUnit);
