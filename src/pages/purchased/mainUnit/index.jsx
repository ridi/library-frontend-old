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
} from '../../../services/purchased/mainUnit/selectors';
import { toFlatten } from '../../../utils/array';
import BottomActionBar from '../../base/BottomActionBar';
import { TabBar, TabMenuTypes, TitleAndEditingBar } from '../../base/LNB';
import Responsive from '../../base/Responsive';

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

  renderLNB() {
    const { isEditing } = this.state;
    const {
      items,
      selectedBooks,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
      unit,
      totalCount,
      mainPageInfo: { currentPage: page, orderType, orderBy, filter },
    } = this.props;
    const totalSelectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = totalSelectedCount === items.length;

    const titleBarProps = {
      title: unit.title,
      totalCount: totalCount.itemTotalCount,
      toggleEditingMode: this.toggleEditingMode,
      href: URLMap.main.href,
      as: URLMap.main.as,
      query: { page, orderType, orderBy, filter },
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

  renderDetailView() {
    const { unit, items, books, bookDescriptions } = this.props;
    const primaryItem = items[0];
    if (!primaryItem) {
      return null;
    }

    const primaryBookId = primaryItem.b_id;
    const primaryBook = books[primaryBookId];
    const primaryBookDescription = bookDescriptions[primaryBookId];
    const downloadable = new Date(primaryItem.expire_date) > new Date();

    return <UnitDetailView unit={unit} book={primaryBook} bookDescription={primaryBookDescription} downloadable={downloadable} />;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, dispatchToggleSelectBook } = this.props;

    if (items.length === 0) {
      return <EmptyBookList message="구매/대여하신 책이 없습니다." />;
    }

    return (
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
    const { unit, items, isFetchingBook } = this.props;

    return (
      <>
        <Head>
          <title>{unit.title} 내 서재</title>
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
                {!UnitType.isBook(unit.type) ? this.renderBooks() : null}
              </>
            )}
          </Responsive>
        </main>
        {this.renderPaginator()}
        {this.renderBottomActionBar()}
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);

  const unitId = getUnitId(state);
  const unit = getUnit(state, unitId);

  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const bookDescriptions = getBookDescriptions(state, toFlatten(items, 'b_id'));

  const totalCount = getTotalCount(state);
  const selectedBooks = getSelectedBooks(state);
  const isFetchingBook = getIsFetchingBook(state);

  const mainPageInfo = getMainPageInfo(state);

  return {
    pageInfo,
    items,
    unit,
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
