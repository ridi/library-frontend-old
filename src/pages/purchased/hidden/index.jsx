/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ButtonType } from '../../../components/ActionBar/constants';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
import PageRedirect from '../../../components/PageRedirect';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import TitleBar from '../../../components/TitleBar';
import * as featureIds from '../../../constants/featureIds';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import { getUnits } from '../../../services/book/selectors';
import { showConfirm } from '../../../services/confirm/actions';
import * as featureSelectors from '../../../services/feature/selectors';
import { deleteSelectedBooks, loadItems, selectAllBooks, unhideSelectedBooks } from '../../../services/purchased/hidden/actions';
import { getIsFetchingBooks, getItemsByPage, getTotalCount, getTotalPages } from '../../../services/purchased/hidden/selectors';
import { clearSelectedItems } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import BookOutline from '../../../svgs/BookOutline.svg';
import { toFlatten } from '../../../utils/array';
import { ResponsiveBooks } from '../../base/Responsive';

function extractOptions({ location }) {
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get('page'), 10) || 1;
  return { page };
}

function makeBackLocation({ location }) {
  if (location.state?.backLocation != null) {
    return location.state.backLocation;
  }
  return {
    pathname: URLMap.main.as,
  };
}

class Hidden extends React.Component {
  static async prepare({ dispatch, location }) {
    const { page } = extractOptions({ location });
    dispatch(clearSelectedItems());
    dispatch(loadItems(page));
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
    const { currentPage, dispatchUnhideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchUnhideSelectedBooks(currentPage);
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  deleteSelectedBooks = () => {
    const { currentPage, dispatchDeleteSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDeleteSelectedBooks(currentPage);
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDelete = () => {
    this.props.dispatchShowConfirm({
      title: '영구 삭제',
      message: (
        <>
          내 서재에서 영구히 삭제되며 다시 구매해야 이용할 수 있습니다.
          <br />
          <br />
          그래도 삭제하시겠습니까?
        </>
      ),
      confirmLabel: '삭제',
      onClickConfirmButton: this.deleteSelectedBooks,
    });
  };

  handleRefreshClick = () => this.props.dispatchLoadItems(this.props.currentPage);

  handleSelectAllBooks = () => this.props.dispatchSelectAllBooks(this.props.currentPage);

  linkBuilder = libraryBookData => {
    const to = {
      pathname: URLMap.hiddenUnit.as({ unitId: libraryBookData.unit_id }),
      state: {
        backLocation: this.props.location,
      },
    };
    return <Link to={to}>더보기</Link>;
  };

  makeEditingBarProps() {
    const { isSyncShelfEnabled, items, totalSelectedCount, dispatchClearSelectedBooks } = this.props;
    const filteredItems = isSyncShelfEnabled ? items.filter(item => !UnitType.isCollection(item.unit_type)) : items;
    const isSelectedAllBooks = totalSelectedCount === filteredItems.length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: this.handleSelectAllBooks,
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
          type: ButtonType.SPACER,
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
    const { location, totalCount } = this.props;

    const titleBarProps = {
      backLocation: makeBackLocation({ location }),
      title: '숨긴 도서 목록',
      showCount: totalCount.itemTotalCount > 0,
      totalCount: totalCount.itemTotalCount,
      edit: true,
      showTools: true,
      toggleEditingMode: this.toggleEditingMode,
    };

    return <TitleBar {...titleBarProps} />;
  }

  renderBooks() {
    const { isEditing: isSelectMode } = this.state;
    const { items: libraryBookDTO, units, isFetchingBooks, viewType } = this.props;
    const showSkeleton = isFetchingBooks && libraryBookDTO.length === 0;

    return showSkeleton ? (
      <SkeletonBooks viewType={viewType} />
    ) : (
      <>
        <Books
          {...{
            libraryBookDTO,
            units,
            isSelectMode,
            viewType,
            linkBuilder: this.linkBuilder,
          }}
        />
        {this.renderPaginator()}
      </>
    );
  }

  renderPaginator() {
    const { currentPage, totalPages } = this.props;
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} />;
  }

  renderMain() {
    const { isFetchingBooks, isError, items } = this.props;

    if (isError) {
      return <BookError onClickRefreshButton={this.handleRefreshClick} />;
    }

    if (!isFetchingBooks && items.length === 0) {
      return <Empty IconComponent={BookOutline} message="숨긴 도서가 없습니다." />;
    }

    return <ResponsiveBooks>{this.renderBooks()}</ResponsiveBooks>;
  }

  render() {
    const { isEditing } = this.state;
    const { currentPage, totalPages } = this.props;

    return (
      <>
        <Helmet>
          <title>숨긴 도서 목록 - 내 서재</title>
        </Helmet>
        <PageRedirect currentPage={currentPage} totalPages={totalPages} />
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

const mapStateToProps = (state, props) => {
  const { page: currentPage } = extractOptions(props);
  const items = getItemsByPage(state, currentPage);
  const units = getUnits(state, toFlatten(items, 'unit_id'));
  const totalCount = getTotalCount(state);
  const totalPages = getTotalPages(state);
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  const isSyncShelfEnabled = featureSelectors.getIsFeatureEnabled(state, featureIds.SYNC_SHELF);

  return {
    currentPage,
    items,
    units,
    totalCount,
    totalPages,
    totalSelectedCount,
    isFetchingBooks,
    viewType: state.ui.viewType,
    isError: state.ui.isError,
    isSyncShelfEnabled,
  };
};

const mapDispatchToProps = {
  dispatchShowConfirm: showConfirm,
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedItems,
  dispatchUnhideSelectedBooks: unhideSelectedBooks,
  dispatchDeleteSelectedBooks: deleteSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Hidden);
