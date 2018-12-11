/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';

import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook/index';
import Paginator from '../../components/Paginator';
import {
  clearSelectedHiddenUnitBooks,
  selectAllHiddenUnitBooks,
  toggleSelectHiddenUnitBook,
  deleteSelectedHiddenUnitBooks,
  loadHiddenUnitItems,
  setHiddenUnitId,
  unHideSelectedHiddenUnitBooks,
} from '../../services/purchased/hiddenUnit/actions';

import { getBooks } from '../../services/book/selectors';

import { toFlatten } from '../../utils/array';
import { PAGE_COUNT } from '../../constants/page';
import Responsive from '../base/Responsive';
import { URLMap } from '../../constants/urls';
import LNBTabBar, { TabMenuTypes } from '../base/LNB/LNBTabBar';
import { BottomActionBar, BottomActionButton } from '../../components/BottomActionBar';
import EditingBar from '../../components/EditingBar';
import IconButton from '../../components/IconButton';
import ModalBackground from '../../components/ModalBackground';
import { getItemsByPage, getPageInfo, getSelectedBooks } from '../../services/purchased/hiddenUnit/selectors';

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
    await store.dispatch(setHiddenUnitId(query.unitId));
    await store.dispatch(loadHiddenUnitItems());
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
    const { clearSelectedBooks: dispatchClearSelectedBooks } = this.props;

    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    this.setState({ isEditing: !isEditing, showMoreModal: false });
  };

  handleOnClickOutOfModal = () => {
    this.setState({ showMoreModal: false });
  };

  handleOnClickUnHide = () => {
    const { unHideSelectedBooks: dispatchUnHideSelectedBooks, clearSelectedBooks: dispatchClearSelectedBooks } = this.props;

    dispatchUnHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDelete = () => {
    const { deleteSelectedBooks: dispatchDeleteSelectedBooks, clearSelectedBooks: dispatchClearSelectedBooks } = this.props;

    dispatchDeleteSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  renderToolBar() {
    const { isEditing, hideTools } = this.state;
    const { items, selectedBooks, selectAllBooks: dispatchSelectAllBooks, clearSelectedBooks: dispatchClearSelectedBooks } = this.props;

    if (isEditing) {
      const isSelectedAllBooks = Object.keys(selectedBooks).length === items.length;
      return (
        <EditingBar
          totalSelectedCount={Object.keys(selectedBooks).length}
          isSelectedAllBooks={isSelectedAllBooks}
          onClickSelectAllBooks={dispatchSelectAllBooks}
          onClickUnselectAllBooks={dispatchClearSelectedBooks}
          onClickSuccessButton={this.toggleEditingMode}
        />
      );
    }

    return (
      <div css={styles.MainToolBarWrapper}>
        <Responsive css={styles.MainToolBar}>
          {hideTools ? null : (
            <div css={styles.MainToolBarToolsWrapper}>
              <IconButton icon="check_3" a11y="편집" css={styles.MainToolBarIcon} onClick={this.toggleEditingMode} />
            </div>
          )}
        </Responsive>
      </div>
    );
  }

  renderModalBackground() {
    const { showMoreModal } = this.state;
    return <ModalBackground isActive={showMoreModal} onClickModalBackground={this.handleOnClickOutOfModal} />;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, toggleSelectBook: dispatchToggleSelectBook } = this.props;

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
        <BottomActionButton name="선택 숨김 해제" css={styles.MainButtonActionLeft} onClick={this.handleOnClickUnHide} disable={disable} />
        <BottomActionButton name="영구삭제" css={styles.MainButtonActionRight} onClick={this.handleOnClickDelete} disable={disable} />
      </BottomActionBar>
    );
  }

  render() {
    return (
      <>
        <LNBTabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        {this.renderToolBar()}
        <main>
          <Responsive>
            {this.renderBooks()}
            {this.renderPaginator()}
          </Responsive>
        </main>
        {this.renderBottomActionBar()}
        {this.renderModalBackground()}
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const selectedBooks = getSelectedBooks(state);

  return {
    pageInfo,
    items,
    books,
    selectedBooks,
  };
};

const mapDispatchToProps = {
  selectAllBooks: selectAllHiddenUnitBooks,
  clearSelectedBooks: clearSelectedHiddenUnitBooks,
  toggleSelectBook: toggleSelectHiddenUnitBook,
  unHideSelectedBooks: unHideSelectedHiddenUnitBooks,
  deleteSelectedBooks: deleteSelectedHiddenUnitBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HiddenUnit);
