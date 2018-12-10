/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
import Router from 'next/router';

import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook';
import Paginator from '../../components/Paginator';
import IconButton from '../../components/IconButton';
import { BottomActionBar, BottomActionButton } from '../../components/BottomActionBar';
import ModalBackground from '../../components/ModalBackground';
import Responsive from '../base/Responsive';
import LNBTabBar, { TabMenuTypes } from '../base/LNB/LNBTabBar';
import EditingBar from '../../components/EditingBar';
import SearchBar from '../../components/SearchBar';
import FilterModal from '../base/MainModal/FilterModal';
import SortModal from '../base/MainModal/SortModal';

import {
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadMainItems,
  selectAllMainBooks,
  toggleSelectBook,
} from '../../services/purchased/main/actions';

import { getBooks } from '../../services/book/selectors';
import { getFilterOptions, getItemsByPage, getPageInfo, getSelectedBooks } from '../../services/purchased/main/selectors';

import { toFlatten } from '../../utils/array';
import { makeURI } from '../../utils/uri';
import { PAGE_COUNT } from '../../constants/page';
import { MainOrderOptions } from '../../constants/orderOptions';
import { URLMap } from '../../constants/urls';

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

class Main extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadMainItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      showMoreModal: false,
      showFilterModal: false,
      hideTools: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    const { clearSelectedBooks: dispatchClearSelectedBooks } = this.props;

    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    this.setState({ isEditing: !isEditing, showFilterModal: false, showMoreModal: false });
  };

  toggleFilterModal = () => {
    const { showFilterModal } = this.state;
    this.setState({ showFilterModal: !showFilterModal, showMoreModal: false });
  };

  toggleMoreModal = () => {
    const { showMoreModal } = this.state;
    this.setState({ showMoreModal: !showMoreModal, showFilterModal: false });
  };

  handleOnClickOutOfModal = () => {
    this.setState({ showMoreModal: false, showFilterModal: false });
  };

  handleChangeFilter = filter => {
    const { changePurchaseFilter: dispatchChangePurchaseFilter } = this.props;
    this.setState({ showFilterModal: false });
    dispatchChangePurchaseFilter(filter);
  };

  handleChangeOrder = order => {
    const { changePurchaseOrder: dispatchChangePurchaseOrder } = this.props;
    this.setState({ showMoreModal: false });
    dispatchChangePurchaseOrder(order);
  };

  handleOnSubmitSearchBar = value => {
    const { href, as } = URLMap.search;
    Router.push(makeURI(href, { keyword: value }), makeURI(as, { keyword: value }));
  };

  handleOnFocusSearchBar = () => {
    this.setState({
      hideTools: true,
      showFilterModal: false,
      showMoreModal: false,
    });
  };

  handleOnBlurSearchBar = () => {
    this.setState({
      hideTools: false,
      showFilterModal: false,
      showMoreModal: false,
    });
  };

  handleOnClickHide = () => {
    const { hideSelectedBooks: dispatchHideSelectedBooks, clearSelectedBooks: dispatchClearSelectedBooks } = this.props;

    dispatchHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDownload = () => {
    const { downloadSelectedBooks: dispatchDownloadSelectedBooks, clearSelectedBooks: dispatchClearSelectedBooks } = this.props;

    dispatchDownloadSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  renderToolBar() {
    const { isEditing, hideTools } = this.state;
    const {
      items,
      selectedBooks,
      selectAllMainBooks: dispatchSelectAllMainBooks,
      clearSelectedBooks: dispatchClearSelectedBooks,
    } = this.props;

    if (isEditing) {
      const isSelectedAllBooks = Object.keys(selectedBooks).length === items.length;
      return (
        <EditingBar
          totalSelectedCount={Object.keys(selectedBooks).length}
          isSelectedAllBooks={isSelectedAllBooks}
          onClickSelectAllBooks={dispatchSelectAllMainBooks}
          onClickUnselectAllBooks={dispatchClearSelectedBooks}
          onClickSuccessButton={this.toggleEditingMode}
        />
      );
    }

    return (
      <div css={styles.MainToolBarWrapper}>
        <Responsive css={styles.MainToolBar}>
          <div css={[styles.MainToolBarSearchBarWrapper, hideTools && styles.MainToolBarSearchBarWrapperActive]}>
            <SearchBar onSubmit={this.handleOnSubmitSearchBar} onFocus={this.handleOnFocusSearchBar} onBlur={this.handleOnBlurSearchBar} />
          </div>
          {hideTools ? null : (
            <div css={styles.MainToolBarToolsWrapper}>
              <IconButton icon="setting" a11y="필터" css={styles.MainToolBarIcon} onClick={this.toggleFilterModal} />
              <IconButton icon="check_3" a11y="편집" css={styles.MainToolBarIcon} onClick={this.toggleEditingMode} />
              <IconButton icon="check_1" a11y="정렬" css={styles.MainToolBarIcon} onClick={this.toggleMoreModal} />
            </div>
          )}
        </Responsive>
      </div>
    );
  }

  renderModal() {
    const { showFilterModal, showMoreModal } = this.state;
    const {
      pageInfo: { order, orderType, orderBy, filter },
      filterOptions,
    } = this.props;

    return (
      <>
        <FilterModal filter={filter} filterOptions={filterOptions} query={{ orderType, orderBy }} isActive={showFilterModal} />
        <SortModal order={order} orderOptions={MainOrderOptions.toList()} query={{ filter }} isActive={showMoreModal} />
      </>
    );
  }

  renderModalBackground() {
    const { showFilterModal, showMoreModal } = this.state;
    return <ModalBackground isActive={showFilterModal || showMoreModal} onClickModalBackground={this.handleOnClickOutOfModal} />;
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
      pageInfo: { orderType, orderBy, filter, currentPage, totalPages },
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        href={URLMap.main.href}
        as={URLMap.main.as}
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
  selectAllMainBooks,
  clearSelectedBooks,
  toggleSelectBook,
  hideSelectedBooks,
  downloadSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
