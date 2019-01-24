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
import SkeletonBookList from '../../../components/Skeleton/SkeletonBookList';
import { URLMap } from '../../../constants/urls';
import { getBookDescriptions, getBooks, getUnit } from '../../../services/book/selectors';
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
import { TabBar, TabMenuTypes } from '../../base/LNB';
import Responsive from '../../base/Responsive';
import { UnitType } from '../../../constants/unitType';
import TitleBar from '../../../components/TitleBar';
import Editable from '../../../components/Editable';
import SeriesToolBar from '../../../components/SeriesToolBar';
import UnitSortModal from '../../base/Modal/UnitSortModal';
import { UnitOrderOptions } from '../../../constants/orderOptions';
import ViewType from '../../../constants/viewType';

class searchUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(loadItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      showSortModal: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    const { dispatchClearSelectedBooks } = this.props;

    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    this.setState({ isEditing: !isEditing, showSortModal: false });
  };

  toggleSortModal = () => {
    const { showSortModal } = this.state;
    this.setState({ showSortModal: !showSortModal });
  };

  handleOnClickOutOfModal = () => {
    this.setState({ showSortModal: false });
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
    const { isEditing } = this.state;
    const { items, selectedBooks, dispatchSelectAllBooks, dispatchClearSelectedBooks } = this.props;
    const totalSelectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = totalSelectedCount === items.length;

    return {
      isEditing,
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
      title: unit.title,
      showCount: !UnitType.isBook(unit.type),
      totalCount: totalCount.itemTotalCount,
      href: URLMap.search.href,
      as: URLMap.search.as,
      query: { keyword, page },
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

    const downloadable = new Date(primaryItem.expire_date) > new Date();
    return <UnitDetailView unit={unit} book={primaryBook} bookDescription={primaryBookDescription} downloadable={downloadable} />;
  }

  renderSeriesToolBar() {
    const {
      unit,
      pageInfo: { order },
    } = this.props;
    const orderOptions = UnitType.isSeries(unit.type) ? UnitOrderOptions.toSeriesList() : UnitOrderOptions.toShelfList();
    return (
      <SeriesToolBar
        orderTitle={orderOptions[order].title}
        toggleSortModal={this.toggleSortModal}
        toggleEditingMode={this.toggleEditingMode}
      />
    );
  }

  renderBooks() {
    const { isEditing, showSortModal } = this.state;
    const {
      unit,
      items,
      books,
      selectedBooks,
      dispatchToggleSelectBook,
      isFetchingBook,
      pageInfo: { order },
    } = this.props;
    const showSkeleton = isFetchingBook && items.length === 0;

    if (showSkeleton) {
      return <SkeletonBookList viewType={ViewType.LANDSCAPE} />;
    }

    if (items.length === 0) {
      return <EmptyBookList icon="book_5" message="구매/대여하신 책이 없습니다." />;
    }

    const orderOptions = UnitType.isSeries(unit.type) ? UnitOrderOptions.toSeriesList() : UnitOrderOptions.toShelfList();
    return (
      <Editable
        isEditing={isEditing}
        nonEditBar={this.renderSeriesToolBar()}
        editingBarProps={this.makeEditingBarProps()}
        actionBarProps={this.makeActionBarProps()}
      >
        <Responsive>
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
          <UnitSortModal
            order={order}
            orderOptions={orderOptions}
            isActive={showSortModal}
            onClickModalBackground={this.handleOnClickOutOfModal}
            href={{ pathname: URLMap.mainUnit.href, query: { unitId: unit.id } }}
            as={URLMap.mainUnit.as(unit.id)}
          />
        </Responsive>
        {this.renderPaginator()}
      </Editable>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { orderType, orderBy, currentPage, totalPages, unitId, keyword },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={{ pathname: URLMap.searchUnit.href, query: { unitId } }}
        as={{ pathname: URLMap.searchUnit.as(unitId) }}
        query={{ orderType, orderBy, keyword }}
      />
    );
  }

  renderMain() {
    const { unit, items, isFetchingBook } = this.props;

    if (!isFetchingBook && items.length === 0) {
      return <EmptyBookList icon="book_5" message="구매/대여하신 책이 없습니다." />;
    }

    return (
      <>
        <Responsive>{this.renderDetailView()}</Responsive>
        {UnitType.isBook(unit.type) ? null : this.renderBooks()}
      </>
    );
  }

  render() {
    const { unit } = this.props;

    return (
      <>
        <Head>
          <title>{unit.title} - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        {this.renderTitleBar()}
        <main>{this.renderMain()}</main>
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
    bookDescriptions,
    totalCount,
    selectedBooks,
    isFetchingBook,

    searchPageInfo,
  };
};

const mapDispatchToProps = {
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
