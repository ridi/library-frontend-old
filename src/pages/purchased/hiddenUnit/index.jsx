/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import BookList from '../../../components/BookList';
import EmptyBookList from '../../../components/EmptyBookList';
import LibraryBook from '../../../components/LibraryBook/index';
import SkeletonUnitDetailView from '../../../components/Skeleton/SkeletonUnitDetailView';
import UnitDetailView from '../../../components/UnitDetailView';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SeriesToolBar from '../../../components/SeriesToolBar';
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
import Editable from '../../../components/Editable';
import TitleBar from '../../../components/TitleBar';
import { ButtonType } from '../../../components/ActionBar/constants';
import { UnitType } from '../../../constants/unitType';
import SkeletonBookList from '../../../components/Skeleton/SkeletonBookList';

class HiddenUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
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

  handleOnClickUnhide = () => {
    const { dispatchUnHideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchUnHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDelete = () => {
    const { dispatchDeleteSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDeleteSelectedBooks();
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

    return <UnitDetailView unit={unit} book={primaryBook} bookDescription={primaryBookDescription} />;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, dispatchToggleSelectBook, isFetchingBook } = this.props;
    const showSkeleton = isFetchingBook && items.length === 0;

    if (showSkeleton) {
      return <SkeletonBookList />;
    }

    if (items.length === 0) {
      return <EmptyBookList message="숨김 도서가 없습니다." />;
    }

    return (
      <Editable
        isEditing={isEditing}
        nonEditBar={<SeriesToolBar toggleEditingMode={this.toggleEditingMode} />}
        editingBarProps={this.makeEditingBarProps()}
        actionBarProps={this.makeActionBarProps()}
      >
        <BookList>
          {items.map(item => (
            <LibraryBook
              key={item.b_id}
              item={item}
              book={books[item.b_id]}
              isEditing={isEditing}
              checked={!!selectedBooks[item.b_id]}
              onChangeCheckbox={() => dispatchToggleSelectBook(item.b_id)}
            />
          ))}
        </BookList>
        {this.renderPaginator()}
      </Editable>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages, unitId },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={{ pathname: URLMap.hiddenUnit.href, query: { unitId } }}
        as={URLMap.hiddenUnit.as(unitId)}
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
          <Responsive>
            {this.renderDetailView()}
            {UnitType.isBook(unit.type) ? null : this.renderBooks()}
          </Responsive>
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

  const books = getBooks(state, toFlatten(items, 'b_id'));
  const bookDescriptions = getBookDescriptions(state, toFlatten(items, 'b_id'));

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
