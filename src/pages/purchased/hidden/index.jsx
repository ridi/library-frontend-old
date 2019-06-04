/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';
import { ButtonType } from '../../../components/ActionBar/constants';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import TitleBar from '../../../components/TitleBar';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import { getBooks, getUnits } from '../../../services/book/selectors';
import { showConfirm } from '../../../services/confirm/actions';
import { deleteSelectedBooks, loadItems, selectAllBooks, unhideSelectedBooks } from '../../../services/purchased/hidden/actions';
import { getIsFetchingBooks, getItemsByPage, getPageInfo, getTotalCount } from '../../../services/purchased/hidden/selectors';
import { getPageInfo as getMainPageInfo } from '../../../services/purchased/main/selectors';
import { clearSelectedBooks } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import BookOutline from '../../../svgs/BookOutline.svg';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import { ResponsiveBooks } from '../../base/Responsive';

class Hidden extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(clearSelectedBooks());
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

  deleteSelectedBooks = () => {
    const { dispatchDeleteSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDeleteSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDelete = () => {
    this.props.dispatchShowConfirm(
      '영구 삭제',
      <>
        내 서재에서 영구히 삭제되며 다시 구매해야 이용할 수 있습니다.
        <br />
        <br />
        그래도 삭제하시겠습니까?
      </>,
      '삭제',
      this.deleteSelectedBooks,
    );
  };

  makeEditingBarProps() {
    const { items, totalSelectedCount, dispatchSelectAllBooks, dispatchClearSelectedBooks } = this.props;
    const isSelectedAllBooks = totalSelectedCount === items.filter(item => !UnitType.isCollection(item.unit_type)).length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: dispatchSelectAllBooks,
      onClickUnselectAllItem: dispatchClearSelectedBooks,
      onClickSuccessButton: this.toggleEditingMode,
    };
  }

  makeActionBarProps() {
    const { totalSelectedCount } = this.props;
    const disable = totalSelectedCount === 0;

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
      showCount: totalCount.itemTotalCount > 0,
      totalCount: totalCount.itemTotalCount,
      href: URLMap.main.href,
      as: URLMap.main.as,
      query: { page, orderType, orderBy, filter },
      edit: true,
      showTools: true,
      toggleEditingMode: this.toggleEditingMode,
    };

    return <TitleBar {...titleBarProps} />;
  }

  renderBooks() {
    const { isEditing: isSelectMode } = this.state;
    const { items: libraryBookDTO, books: platformBookDTO, units, isFetchingBooks, viewType } = this.props;
    const linkBuilder = () => libraryBookData => {
      const linkProps = makeLinkProps(
        {
          pathname: URLMap.hiddenUnit.href,
          query: { unitId: libraryBookData.unit_id },
        },
        URLMap.hiddenUnit.as({ unitId: libraryBookData.unit_id }),
      );

      return (
        <Link prefetch {...linkProps}>
          <a>더보기</a>
        </Link>
      );
    };
    const showSkeleton = isFetchingBooks && libraryBookDTO.length === 0;

    return showSkeleton ? (
      <SkeletonBooks viewType={viewType} />
    ) : (
      <>
        <Books
          {...{
            libraryBookDTO,
            platformBookDTO,
            units,
            isSelectMode,
            viewType,
            linkBuilder: linkBuilder(),
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
      return <Empty IconComponent={BookOutline} message="숨긴 도서가 없습니다." />;
    }

    return <ResponsiveBooks>{this.renderBooks()}</ResponsiveBooks>;
  }

  render() {
    const { isEditing } = this.state;
    const { isError, dispatchLoadItems } = this.props;

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
          <main>{isError ? <BookError onClickRefreshButton={() => dispatchLoadItems()} /> : this.renderMain()}</main>
        </Editable>
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const units = getUnits(state, toFlatten(items, 'unit_id'));
  const totalCount = getTotalCount(state);
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  const mainPageInfo = getMainPageInfo(state);

  return {
    pageInfo,
    items,
    books,
    units,
    totalCount,
    totalSelectedCount,
    isFetchingBooks,
    mainPageInfo,
    viewType: state.ui.viewType,
    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchShowConfirm: showConfirm,
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchUnhideSelectedBooks: unhideSelectedBooks,
  dispatchDeleteSelectedBooks: deleteSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Hidden);
