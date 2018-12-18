/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { css, jsx } from '@emotion/core';

import LNBHiddenTitleBar from '../base/LNB/LNBHiddenTitleBar';
import Responsive from '../base/Responsive';
import EditingBar from '../../components/EditingBar';
import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook/index';
import Paginator from '../../components/Paginator';
import { BottomActionBar, BottomActionButton } from '../../components/BottomActionBar';

import { getBooks } from '../../services/book/selectors';
import {
  clearSelectedBooks,
  deleteSelectedBooks,
  loadItems,
  selectAllBooks,
  setUnitId,
  toggleSelectBook,
  unhideSelectedBooks,
} from '../../services/purchased/hiddenUnit/actions';
import { getItemsByPage, getPageInfo, getItemTotalCount, getSelectedBooks } from '../../services/purchased/hiddenUnit/selectors';
import { PAGE_COUNT } from '../../constants/page';
import { URLMap } from '../../constants/urls';

import { toFlatten } from '../../utils/array';

const styles = {
  MainToolBarWrapper: css({
    height: 46,
    backgroundColor: '#f3f4f5',
    boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
    boxSizing: 'border-box',
    borderBottom: '1px solid #d1d5d9',
  }),
  MainToolBar: css({
    display: 'flex',
  }),
  MainToolBarSearchBarWrapper: css({
    padding: '8px 0',
    height: 30,
    flex: 1,
    maxWidth: 600,
  }),
  MainToolBarSearchBarWrapperActive: css({
    maxWidth: 'initial',
  }),
  MainToolBarToolsWrapper: css({
    height: 30,
    padding: '8px 0 8px 16px',
    marginLeft: 'auto',
  }),
  MainToolBarIcon: css({
    margin: '3px 0',
    width: 24,
    height: 24,
    marginRight: 16,
    '&:last-of-type': {
      marginRight: 0,
    },
    '.RSGIcon': {
      width: 24,
      height: 24,
    },
  }),
  MainButtonActionLeft: css({
    float: 'left',
  }),
  MainButtonActionRight: css({
    float: 'right',
  }),
};

class HiddenUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unitId));
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

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, dispatchToggleSelectBook } = this.props;

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

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages, unitId },
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        href={URLMap.hiddenUnit.href}
        as={URLMap.hiddenUnit.as(unitId)}
      />
    );
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
        <BottomActionButton name="선택 숨김 해제" css={styles.MainButtonActionLeft} onClick={this.handleOnClickUnhide} disable={disable} />
        <BottomActionButton name="영구삭제" css={styles.MainButtonActionRight} onClick={this.handleOnClickDelete} disable={disable} />
      </BottomActionBar>
    );
  }

  render() {
    const { isEditing } = this.state;
    const { itemTotalCount } = this.props;
    return (
      <>
        <Head>
          <title>리디북스 - 숨김목록</title>
        </Head>
        {isEditing ? (
          this.renderToolBar()
        ) : (
          <LNBHiddenTitleBar
            title="숨긴 도서 목록"
            hiddenTotalCount={itemTotalCount}
            onClickEditingMode={this.toggleEditingMode}
            href={URLMap.main.href}
            as={URLMap.main.as}
          />
        )}
        <main>
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
  const itemTotalCount = getItemTotalCount(state);
  const selectedBooks = getSelectedBooks(state);

  return {
    pageInfo,
    items,
    books,
    itemTotalCount,
    selectedBooks,
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
