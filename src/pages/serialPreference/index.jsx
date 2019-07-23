/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { ButtonType } from '../../components/ActionBar/constants';
import Editable from '../../components/Editable';
import Empty from '../../components/Empty';
import ResponsivePaginator from '../../components/ResponsivePaginator';
import SerialPreferenceBooks from '../../components/SerialPreferenceBooks';
import SerialPreferenceToolBar from '../../components/SerialPreferenceToolBar';
import SkeletonBooks from '../../components/Skeleton/SkeletonBooks';
import { SERIAL_PREFERENCE_ITEMS_LIMIT_PER_PAGE } from '../../constants/page';
import ViewType from '../../constants/viewType';
import { getBooks } from '../../services/book/selectors';
import { clearSelectedItems } from '../../services/selection/actions';
import { getTotalSelectedCount } from '../../services/selection/selectors';
import { deleteSelectedBooks, loadItems, selectAllBooks } from '../../services/serialPreference/actions';
import { getIsFetchingBooks, getItemsByPage, getTotalCount, getUnitIdsMap } from '../../services/serialPreference/selectors';
import HeartIcon from '../../svgs/HeartOutline.svg';
import { toFlatten } from '../../utils/array';
import { calcPage } from '../../utils/pagination';
import Footer from '../base/Footer';
import { TabBar, TabMenuTypes } from '../base/LNB';
import { ResponsiveBooks } from '../base/Responsive';

class SerialPreference extends React.Component {
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

  handleOnClickDelete = () => {
    const { dispatchDeleteSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDeleteSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  makeEditingBarProps() {
    const { items, totalSelectedCount, dispatchSelectAllBooks, dispatchClearSelectedBooks } = this.props;
    const isSelectedAllBooks = totalSelectedCount === items.length;

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
          type: ButtonType.SPACER,
        },
        {
          name: '선택 삭제',
          type: ButtonType.DANGER,
          onClick: this.handleOnClickDelete,
          disable,
        },
      ],
    };
  }

  renderToolBar() {
    const { totalCount, isFetchingBooks } = this.props;

    const toolBarProps = {
      isFetchingBooks,
      totalCount,
      toggleEditingMode: this.toggleEditingMode,
    };

    return <SerialPreferenceToolBar {...toolBarProps} />;
  }

  renderBooks() {
    const { isEditing: isSelectMode } = this.state;
    const { items, toUnitIdMap, books: platformBookDTO, isFetchingBooks, viewType } = this.props;

    const showSkeleton = isFetchingBooks && items.length === 0;

    return showSkeleton ? (
      <SkeletonBooks viewType={viewType} />
    ) : (
      <>
        <SerialPreferenceBooks
          items={items}
          toUnitIdMap={toUnitIdMap}
          platformBookDTO={platformBookDTO}
          isSelectMode={isSelectMode}
          viewType={viewType}
        />
        {this.renderPaginator()}
      </>
    );
  }

  renderMain() {
    const { items, isFetchingBooks } = this.props;

    if (!isFetchingBooks && items.length === 0) {
      return <Empty IconComponent={HeartIcon} iconWidth={44} message="등록하신 선호 작품이 없습니다." />;
    }

    return <ResponsiveBooks>{this.renderBooks()}</ResponsiveBooks>;
  }

  renderPaginator() {
    const { currentPage, totalCount } = this.props;
    const totalPages = calcPage(totalCount, SERIAL_PREFERENCE_ITEMS_LIMIT_PER_PAGE);
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} />;
  }

  render() {
    const { isEditing } = this.state;

    return (
      <>
        <Helmet>
          <title>선호 작품 - 내 서재</title>
        </Helmet>
        <TabBar activeMenu={TabMenuTypes.SERIAL_PREFERENCE} />
        <Editable
          allowFixed
          isEditing={isEditing}
          nonEditBar={this.renderToolBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.makeActionBarProps()}
        >
          <main>{this.renderMain()}</main>
          <Footer />
        </Editable>
      </>
    );
  }
}

const extractCurrentPage = locationSearch => {
  const urlParams = new URLSearchParams(locationSearch);
  return parseInt(urlParams.get('page'), 10) || 1;
};

SerialPreference.prepare = async ({ dispatch, location }) => {
  await dispatch(clearSelectedItems());
  await dispatch(loadItems(extractCurrentPage(location.search)));
};

const mapStateToProps = (state, props) => {
  const currentPage = extractCurrentPage(props.location.search);
  const items = getItemsByPage(state, currentPage);
  const seriesBookIds = toFlatten(items, 'series_id');
  const toUnitIdMap = getUnitIdsMap(state, seriesBookIds);
  const books = getBooks(state, [...seriesBookIds, ...toFlatten(items, 'recent_read_b_id')]);
  const totalCount = getTotalCount(state);
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  return {
    items,
    toUnitIdMap,
    books,
    currentPage,
    totalCount,
    totalSelectedCount,
    isFetchingBooks,
    viewType: ViewType.LANDSCAPE,
  };
};

const mapDispatchToProps = {
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedItems,
  dispatchDeleteSelectedBooks: deleteSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SerialPreference);
