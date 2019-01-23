/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import BookList from '../../../components/BookList';
import EmptyBookList from '../../../components/EmptyBookList';
import LibraryBook from '../../../components/LibraryBook';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SkeletonBookList from '../../../components/Skeleton/SkeletonBookList';
import { URLMap } from '../../../constants/urls';
import { getBooks } from '../../../services/book/selectors';
import {
  clearSelectedBooks,
  deleteSelectedBooks,
  loadItems,
  selectAllBooks,
  toggleSelectBook,
  unhideSelectedBooks,
} from '../../../services/purchased/hidden/actions';
import {
  getIsFetchingBooks,
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
  getTotalCount,
} from '../../../services/purchased/hidden/selectors';
import { getPageInfo as getMainPageInfo } from '../../../services/purchased/main/selectors';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import Responsive from '../../base/Responsive';
import { ButtonType } from '../../../components/ActionBar/constants';
import TitleBar from '../../../components/TitleBar';
import Editable from '../../../components/Editable';

class Hidden extends React.Component {
  static async getInitialProps({ store }) {
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
    const { dispatchUnhideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchUnhideSelectedBooks();
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
      totalCount,
      mainPageInfo: { currentPage: page, orderType, orderBy, filter },
    } = this.props;

    const titleBarProps = {
      title: '숨긴 도서 목록',
      showCount: true,
      totalCount: totalCount.itemTotalCount,
      href: URLMap.main.href,
      as: URLMap.main.as,
      query: { page, orderType, orderBy, filter },
    };

    return <TitleBar {...titleBarProps} />;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, dispatchToggleSelectBook, isFetchingBooks } = this.props;
    const showSkeleton = isFetchingBooks && items.length === 0;

    if (showSkeleton) {
      return <SkeletonBookList />;
    }

    return (
      <>
        <BookList>
          {items.map(item => (
            <LibraryBook
              key={item.b_id}
              item={item}
              book={books[item.b_id]}
              isEditing={isEditing}
              checked={!!selectedBooks[item.b_id]}
              onChangeCheckbox={() => dispatchToggleSelectBook(item.b_id)}
              {...makeLinkProps({ pathname: URLMap.hiddenUnit.href, query: { unitId: item.unit_id } }, URLMap.hiddenUnit.as(item.unit_id))}
            />
          ))}
        </BookList>
        {this.renderPaginator()}
      </>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages },
    } = this.props;

    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} href={URLMap.hidden.href} as={URLMap.hidden.as} />;
  }

  renderMain() {
    const { items, isFetchingBooks } = this.props;

    if (!isFetchingBooks && items.length === 0) {
      return <EmptyBookList icon="book_5" message="숨김 도서가 없습니다." />;
    }

    return <Responsive>{this.renderBooks()}</Responsive>;
  }

  render() {
    const { isEditing } = this.state;

    return (
      <>
        <Head>
          <title>숨긴 도서 목록 - 내 서재</title>
        </Head>
        <Editable
          isEditing={isEditing}
          nonEditBar={this.renderTitleBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.makeActionBarProps()}
        >
          <main>{this.renderMain()}</main>
        </Editable>
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const totalCount = getTotalCount(state);
  const selectedBooks = getSelectedBooks(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  const mainPageInfo = getMainPageInfo(state);

  return {
    pageInfo,
    items,
    books,
    totalCount,
    selectedBooks,
    isFetchingBooks,

    mainPageInfo,
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
)(Hidden);
