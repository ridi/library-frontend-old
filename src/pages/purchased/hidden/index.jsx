/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { LibraryBooks } from '../../../components/LibraryBooks';
import EmptyBookList from '../../../components/EmptyBookList';
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
      buttonProps: [
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
      edit: true,
      toggleEditingMode: this.toggleEditingMode,
    };

    return <TitleBar {...titleBarProps} />;
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
    const linkPropsBuilder = () => unitId =>
      makeLinkProps(
        {
          pathname: URLMap.hiddenUnit.href,
          query: { unitId },
        },
        URLMap.hiddenUnit.as(unitId),
      );
    const showSkeleton = isFetchingBooks && libraryBookDTO.length === 0;

    return showSkeleton ? (
      <SkeletonBookList viewType={viewType} />
    ) : (
      <>
        <LibraryBooks
          {...{
            libraryBookDTO,
            platformBookDTO,
            selectedBooks,
            isSelectMode,
            onSelectedChange,
            viewType,
            linkPropsBuilder: linkPropsBuilder(),
          }}
        />
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

    return <Responsive hasPadding={false}>{this.renderBooks()}</Responsive>;
  }

  render() {
    const { isEditing } = this.state;

    return (
      <>
        <Head>
          <title>숨긴 도서 목록 - 내 서재</title>
        </Head>
        <Editable
          allowFixed
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
    viewType: state.viewType,
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
