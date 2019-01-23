/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { LibraryBook } from '../../../components/Book';
import EmptyBookList from '../../../components/EmptyBookList';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SkeletonBookList from '../../../components/Skeleton/SkeletonBookList';
import { MainOrderOptions } from '../../../constants/orderOptions';
import { URLMap } from '../../../constants/urls';
import { getBooks } from '../../../services/book/selectors';
import {
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  selectAllBooks,
  toggleSelectBook,
} from '../../../services/purchased/main/actions';
import {
  getFilterOptions,
  getIsFetchingBooks,
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
} from '../../../services/purchased/main/selectors';
import { setViewType } from '../../../services/viewType/actions';
import { toFlatten } from '../../../utils/array';
import { makeURI } from '../../../utils/uri';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import FilterModal from '../../base/Modal/FilterModal';
import SortModal from '../../base/Modal/SortModal';
import Responsive from '../../base/Responsive';
import SearchBar from '../../../components/SearchBar';
import Editable from '../../../components/Editable';
import ViewType from '../../../constants/viewType';

class Main extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadItems());
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
    const { dispatchClearSelectedBooks } = this.props;

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

  handleOnClickViewType = viewType => {
    const { dispatchSetViewType } = this.props;
    dispatchSetViewType(viewType);
    this.handleOnClickOutOfModal();
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

  renderSearchBar() {
    const { hideTools } = this.state;

    const searchBarProps = {
      hideTools,
      handleOnSubmitSearchBar: this.handleOnSubmitSearchBar,
      handleOnFocusSearchBar: this.handleOnFocusSearchBar,
      handleOnBlurSearchBar: this.handleOnBlurSearchBar,
      filter: true,
      toggleFilterModal: this.toggleFilterModal,
      edit: true,
      toggleEditingMode: this.toggleEditingMode,
      more: true,
      toggleMoreModal: this.toggleMoreModal,
    };

    return <SearchBar {...searchBarProps} />;
  }

  renderModal() {
    const { showFilterModal, showMoreModal } = this.state;
    const {
      pageInfo: { order, orderType, orderBy, filter },
      filterOptions,
      viewType,
    } = this.props;

    return (
      <>
        <FilterModal
          filter={filter}
          filterOptions={filterOptions}
          query={{ orderType, orderBy }}
          isActive={showFilterModal}
          onClickModalBackground={this.handleOnClickOutOfModal}
        />
        <SortModal
          order={order}
          orderOptions={MainOrderOptions.toList()}
          query={{ filter }}
          isActive={showMoreModal}
          onClickModalBackground={this.handleOnClickOutOfModal}
          viewType={viewType}
          onClickViewType={this.handleOnClickViewType}
        />
      </>
    );
  }

  renderBooks() {
    const { isEditing: isSelectMode } = this.state;
    const {
      items: libraryBookDTO,
      books: platformBookDTO,
      selectedBooks,
      dispatchToggleSelectBook,
      isFetchingBooks,
      viewType,
    } = this.props;
    const onSelectedChange = dispatchToggleSelectBook;
    const showSkeleton = isFetchingBooks && libraryBookDTO.length === 0;

    if (showSkeleton) {
      return <SkeletonBookList />;
    }

    if (libraryBookDTO.length === 0) {
      return <EmptyBookList message="구매/대여하신 책이 없습니다." />;
    }

    return (
      <>
        <LibraryBook {...{ libraryBookDTO, platformBookDTO, selectedBooks, isSelectMode, onSelectedChange, viewType }} />
        {this.renderPaginator()}
      </>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { orderType, orderBy, filter, currentPage, totalPages },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={URLMap.main.href}
        as={URLMap.main.as}
        query={{ orderType, orderBy, filter }}
      />
    );
  }

  render() {
    const { isEditing } = this.state;
    const { viewType } = this.props;

    return (
      <>
        <Head>
          <title>모든 책 - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        <Editable
          isEditing={isEditing}
          nonEditBar={this.renderSearchBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.makeActionBarProps()}
        >
          <main>
            <Responsive hasPadding={viewType === ViewType.PORTRAIT}>
              {this.renderBooks()}
              {this.renderModal()}
            </Responsive>
          </main>
        </Editable>
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
  const isFetchingBooks = getIsFetchingBooks(state);

  return {
    pageInfo,
    filterOptions,
    items,
    books,
    selectedBooks,
    isFetchingBooks,
    viewType: state.viewType,
  };
};

const mapDispatchToProps = {
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchToggleSelectBook: toggleSelectBook,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
  dispatchSetViewType: setViewType,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
