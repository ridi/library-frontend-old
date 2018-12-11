/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';

import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook/index';
import Paginator from '../../components/Paginator';
import { loadMainUnitItems, setMainUnitId } from '../../services/purchased/mainUnit/actions';

import { getBooks } from '../../services/book/selectors';

import { toFlatten } from '../../utils/array';
import { PAGE_COUNT } from '../../constants/page';
import Responsive from '../base/Responsive';
import { URLMap } from '../../constants/urls';
import LNBTabBar, { TabMenuTypes } from '../base/LNB/LNBTabBar';
import { BottomActionBar, BottomActionButton } from '../../components/BottomActionBar';
import EditingBar from '../../components/EditingBar';
import IconButton from '../../components/IconButton';
import SortModal from '../base/MainModal/SortModal';
import { MainOrderOptions } from '../../constants/orderOptions';
import ModalBackground from '../../components/ModalBackground';
import { getFilterOptions, getItemsByPage, getPageInfo, getSelectedBooks } from '../../services/purchased/mainUnit/selectors';
import {
  clearSelectedMainUnitBooks,
  downloadSelectedMainUnitBooks,
  hideSelectedMainUnitBooks,
  selectAllMainUnitBooks,
  toggleSelectMainUnitBook,
} from '../../services/purchased/mainUnit/actions';

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

class MainUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setMainUnitId(query.unitId));
    await store.dispatch(loadMainUnitItems());
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

  toggleMoreModal = () => {
    const { showMoreModal } = this.state;
    this.setState({ showMoreModal: !showMoreModal });
  };

  handleOnClickOutOfModal = () => {
    this.setState({ showMoreModal: false });
  };

  handleOnClickHide = () => {
    const { hideSelectedBooks: dispatchHideSelectedBooks, clearSelectedBooks: dispatchClearSelectedBooks } = this.props;

    dispatchHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDownload = () => {
    const { downloadSelectedBooks: dispatchDownloadSelectedBooks, clearSelectedMainUnitBooks: dispatchClearSelectedBooks } = this.props;

    dispatchDownloadSelectedBooks();
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
              <IconButton icon="check_1" a11y="정렬" css={styles.MainToolBarIcon} onClick={this.toggleMoreModal} />
            </div>
          )}
        </Responsive>
      </div>
    );
  }

  renderModal() {
    const { showMoreModal } = this.state;
    const {
      pageInfo: { order, filter },
    } = this.props;

    return (
      <>
        <SortModal order={order} orderOptions={MainOrderOptions.toList()} query={{ filter }} isActive={showMoreModal} />
      </>
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
      pageInfo: { orderType, orderBy, filter, currentPage, totalPages, unitId },
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        href={URLMap.mainUnit.href}
        as={URLMap.mainUnit.as(unitId)}
        query={{ orderType, orderBy, filter }}
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
        <BottomActionButton name="선택 숨기기" css={styles.MainButtonActionLeft} onClick={this.handleOnClickHide} disable={disable} />
        <BottomActionButton
          name="선택 다운로드"
          css={styles.MainButtonActionRight}
          onClick={this.handleOnClickDownload}
          disable={disable}
        />
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
            {this.renderModal()}
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
  const filterOptions = getFilterOptions(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const selectedBooks = getSelectedBooks(state);

  return {
    pageInfo,
    filterOptions,
    items,
    books,
    selectedBooks,
  };
};

const mapDispatchToProps = {
  selectAllBooks: selectAllMainUnitBooks,
  clearSelectedBooks: clearSelectedMainUnitBooks,
  toggleSelectBook: toggleSelectMainUnitBook,
  hideSelectedBooks: hideSelectedMainUnitBooks,
  downloadSelectedBooks: downloadSelectedMainUnitBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainUnit);
