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
import { MainOrderOptions } from '../../../constants/orderOptions';
import { URLMap } from '../../../constants/urls';
import { getBooks, getUnit } from '../../../services/book/selectors';
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
  getItems,
  getPageInfo,
  getSelectedBooks,
  getTotalCount,
  getUnitId,
} from '../../../services/purchased/searchUnit/selectors';
import { toFlatten } from '../../../utils/array';
import BottomActionBar from '../../base/BottomActionBar';
import { TabBar, TabMenuTypes, TitleAndEditingBar } from '../../base/LNB';
import SortModal from '../../base/Modal/SortModal';
import Responsive from '../../base/Responsive';
import Scrollable from '../../../components/Scrollable';

class searchUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(loadItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      showMoreModal: false,
      hideTools: false,
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

  renderLNB() {
    const { isEditing } = this.state;
    const {
      unit,
      totalCount,
      pageInfo: { keyword },
      searchPageInfo: { currentPage: page },
      items,
      selectedBooks,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
    } = this.props;
    const totalSelectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = totalSelectedCount === items.length;

    const titleBarProps = {
      title: unit.title,
      totalCount: totalCount.itemTotalCount,
      toggleEditingMode: this.toggleEditingMode,
      href: URLMap.search.href,
      as: URLMap.search.as,
      query: { keyword, page },
    };
    const editingBarProps = {
      isEditing,
      totalSelectedCount,
      isSelectedAllBooks,
      onClickSelectAllBooks: dispatchSelectAllBooks,
      onClickUnselectAllBooks: dispatchClearSelectedBooks,
      onClickSuccessButton: this.toggleEditingMode,
    };
    return <TitleAndEditingBar titleBarProps={titleBarProps} editingBarProps={editingBarProps} />;
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
    const { unit, items, books } = this.props;
    const primaryBook = books[items[0].b_id];
    return <UnitDetailView unit={unit} book={primaryBook} />;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, dispatchToggleSelectBook, dispatchLoadItems, totalCount, isFetchingBook } = this.props;

    if (items.length === 0) {
      return <EmptyBookList message="구매/대여하신 책이 없습니다." />;
    }

    return (
      <Scrollable
        showLoader
        isLoading={isFetchingBook}
        hasMore={totalCount.itemTotalCount > items.length}
        fetch={() => dispatchLoadItems()}
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
      </Scrollable>
    );
  }

  renderBottomActionBar() {
    const { isEditing } = this.state;
    const { selectedBooks } = this.props;
    return (
      <BottomActionBar
        isEditing={isEditing}
        selectedBooks={selectedBooks}
        buttonsProps={[
          {
            name: '선택 숨기기',
            onClick: this.handleOnClickHide,
          },
          {
            name: '선택 다운로드',
            onClick: this.handleOnClickDownload,
          },
        ]}
      />
    );
  }

  render() {
    const { unit, items, isFetchingBook } = this.props;

    return (
      <>
        <Head>
          <title>{unit.title} - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        {this.renderLNB()}
        <main>
          <Responsive>
            {items.length === 0 && isFetchingBook ? (
              <SkeletonUnitDetailView />
            ) : (
              <>
                {this.renderDetailView()}
                {this.renderBooks()}
                {this.renderModal()}
              </>
            )}
          </Responsive>
        </main>
        {this.renderBottomActionBar()}
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);

  const unitId = getUnitId(state);
  const unit = getUnit(state, unitId);

  const items = getItems(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const selectedBooks = getSelectedBooks(state);
  const totalCount = getTotalCount(state);

  const isFetchingBook = getIsFetchingBook(state);

  const searchPageInfo = getSearchPageInfo(state);
  return {
    pageInfo,
    items,
    unit,
    books,
    totalCount,
    selectedBooks,
    isFetchingBook,

    searchPageInfo,
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