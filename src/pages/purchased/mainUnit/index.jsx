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
import SkeletonBookList from '../../../components/Skeleton/SkeletonBookList';
import { MainOrderOptions } from '../../../constants/orderOptions';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import { getBookDescriptions, getBooks, getUnit } from '../../../services/book/selectors';
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
import { TabBar, TabMenuTypes } from '../../base/LNB';
import SortModal from '../../base/Modal/SortModal';
import Responsive from '../../base/Responsive';
import Editable from '../../../components/Editable';
import TitleBar from '../../../components/TitleBar';

class MainUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(loadItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      showMoreModal: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    const { dispatchClearSelectedBooks } = this.props;

    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    this.setState({ isEditing: !isEditing, showMoreModal: false });
  };

  toggleMoreModal = () => {
    const { showMoreModal } = this.state;
    this.setState({ showMoreModal: !showMoreModal });
  };

  handleOnClickOutOfModal = () => {
    this.setState({ showMoreModal: false });
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
      mainPageInfo: { currentPage: page, orderType, orderBy, filter },
    } = this.props;

    const titleBarProps = {
      title: unit.title,
      showCount: !UnitType.isBook(unit.type),
      totalCount: totalCount.itemTotalCount,
      href: URLMap.main.href,
      as: URLMap.main.as,
      query: { page, orderType, orderBy, filter },
    };
    return <TitleBar {...titleBarProps} />;
  }

  renderModal() {
    const { showMoreModal } = this.state;
    const {
      pageInfo: { order },
    } = this.props;

    return (
      <SortModal
        order={order}
        orderOptions={MainOrderOptions.toList()}
        isActive={showMoreModal}
        onClickModalBackground={this.handleOnClickOutOfModal}
      />
    );
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

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, dispatchToggleSelectBook, isFetchingBook } = this.props;
    const showSkeleton = isFetchingBook && items.length === 0;

    if (showSkeleton) {
      return <SkeletonBookList />;
    }

    if (items.length === 0) {
      return <EmptyBookList message="구매/대여하신 책이 없습니다." />;
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
      pageInfo: { orderType, orderBy, currentPage, totalPages, unitId },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={{ pathname: URLMap.mainUnit.href, query: { unitId } }}
        as={URLMap.mainUnit.as(unitId)}
        query={{ orderType, orderBy }}
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
        <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        {this.renderTitleBar()}
        <main>
          <Responsive>
            {this.renderDetailView()}
            {this.renderBooks()}
            {this.renderModal()}
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

  const books = getBooks(state, bookIds);
  const bookDescriptions = getBookDescriptions(state, bookIds);

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
    bookDescriptions,
    totalCount,
    selectedBooks,
    isFetchingBook,

    mainPageInfo,
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
)(MainUnit);
