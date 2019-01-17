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
import BottomActionBar from '../../base/BottomActionBar';
import { TitleAndEditingBar } from '../../base/LNB';
import Responsive from '../../base/Responsive';
import * as styles from './styles';

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

  renderLNB() {
    const { isEditing } = this.state;
    const {
      items,
      selectedBooks,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
      totalCount,
      mainPageInfo: { currentPage: page, orderType, orderBy, filter },
    } = this.props;
    const totalSelectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = totalSelectedCount === items.length;
    const titleBarProps = {
      title: '숨긴 도서 목록',
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

  renderBooks() {
    const { isEditing } = this.state;
    const { isFetchingBooks, items, books, selectedBooks, dispatchToggleSelectBook } = this.props;

    if (items.length === 0) {
      if (isFetchingBooks) {
        return <SkeletonBookList />;
      }
      return <EmptyBookList message="숨김 도서가 없습니다." />;
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
            {...makeLinkProps({ pathname: URLMap.hiddenUnit.href, query: { unitId: item.unit_id } }, URLMap.hiddenUnit.as(item.unit_id))}
          />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages },
    } = this.props;

    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} href={URLMap.hidden.href} as={URLMap.hidden.as} />;
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
            name: '선택 영구 삭제',
            onClick: this.handleOnClickDelete,
          },
          {
            name: '선택 숨김 해제',
            onClick: this.handleOnClickUnhide,
          },
        ]}
      />
    );
  }

  render() {
    const { isFetchingBooks } = this.props;

    return (
      <>
        <Head>
          <title>숨긴 도서 목록 - 내 서재</title>
        </Head>
        {this.renderLNB()}
        <main css={isFetchingBooks && styles.hiddenFetchingBooks}>
          <Responsive>{this.renderBooks()}</Responsive>
        </main>
        {this.renderPaginator()}
        {this.renderBottomActionBar()}
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
