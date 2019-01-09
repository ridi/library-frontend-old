/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import Head from 'next/head';
import { connect } from 'react-redux';
import EmptyBookList from '../../components/EmptyBookList';
import ResponsivePaginator from '../../components/ResponsivePaginator';

import LNBTitleBar from '../base/LNB/LNBTitleBar';
import Responsive from '../base/Responsive';
import EditingBar from '../../components/EditingBar';
import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook';
import { BottomActionBar, BottomActionButton } from '../../components/BottomActionBar';

import { getBooks } from '../../services/book/selectors';
import {
  loadItems,
  selectAllBooks,
  clearSelectedBooks,
  toggleSelectBook,
  unhideSelectedBooks,
  deleteSelectedBooks,
} from '../../services/purchased/hidden/actions';
import {
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
  getTotalCount,
  getIsFetchingBooks,
} from '../../services/purchased/hidden/selectors';
import { getPageInfo as getMainPageInfo } from '../../services/purchased/main/selectors';

import { URLMap } from '../../constants/urls';

import { toFlatten } from '../../utils/array';
import SkeletonBookList from '../../components/Skeleton/SkeletonBookList';
import { makeLinkProps } from '../../utils/uri';

const styles = {
  hiddenFetchingBooks: css({
    backgroundColor: 'white',
  }),
  hiddenButtonActionLeft: css({
    color: '#e64938',
    float: 'left',
  }),
  hiddenButtonActionRight: css({
    float: 'right',
  }),
};

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

  renderToolBar() {
    const { items, selectedBooks, dispatchSelectAllBooks, dispatchClearSelectedBooks } = this.props;

    const selectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = selectedCount === items.length;

    return (
      <EditingBar
        totalSelectedCount={selectedCount}
        isSelectedAllBooks={isSelectedAllBooks}
        onClickSelectAllBooks={dispatchSelectAllBooks}
        onClickUnselectAllBooks={dispatchClearSelectedBooks}
        onClickSuccessButton={this.toggleEditingMode}
      />
    );
  }

  renderTitleBar() {
    const {
      totalCount,
      mainPageInfo: { currentPage: page, orderType, orderBy, filter },
    } = this.props;
    return (
      <LNBTitleBar
        title="숨긴 도서 목록"
        totalCount={totalCount.itemTotalCount}
        onClickEditingMode={this.toggleEditingMode}
        {...makeLinkProps(URLMap.main.href, URLMap.main.as, { page, orderType, orderBy, filter })}
      />
    );
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
    if (!isEditing) {
      return null;
    }

    const disable = Object.keys(selectedBooks).length === 0;
    return (
      <BottomActionBar>
        <BottomActionButton
          name="선택 영구 삭제"
          css={styles.hiddenButtonActionLeft}
          onClick={this.handleOnClickDelete}
          disable={disable}
        />
        <BottomActionButton
          name="선택 숨김 해제"
          css={styles.hiddenButtonActionRight}
          onClick={this.handleOnClickUnhide}
          disable={disable}
        />
      </BottomActionBar>
    );
  }

  render() {
    const { isEditing } = this.state;
    const { isFetchingBooks } = this.props;

    return (
      <>
        <Head>
          <title>숨긴 도서 목록 - 내 서재</title>
        </Head>
        {isEditing ? this.renderToolBar() : this.renderTitleBar()}
        <main css={isFetchingBooks && styles.hiddenFetchingBooks}>
          <Responsive>
            {this.renderBooks()}
            {this.renderPaginator()}
          </Responsive>
        </main>
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
