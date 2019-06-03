/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { ButtonType } from '../../components/ActionBar/constants';
import Editable from '../../components/Editable';
import Empty from '../../components/Empty';
import ResponsivePaginator from '../../components/ResponsivePaginator';
import SerialPreferenceBooks from '../../components/SerialPreferenceBooks';
import SerialPreferenceToolBar from '../../components/SerialPreferenceToolBar';
import SkeletonBooks from '../../components/Skeleton/SkeletonBooks';
import { URLMap } from '../../constants/urls';
import ViewType from '../../constants/viewType';
import { getBooks } from '../../services/book/selectors';
import { deleteSelectedBooks, loadItems, selectAllBooks } from '../../services/serialPreference/actions';
import { clearSelectedBooks } from '../../services/selection/actions';
import { getTotalSelectedCount } from '../../services/selection/selectors';
import { getIsFetchingBooks, getItemsByPage, getPageInfo, getTotalCount, getUnitIdsMap } from '../../services/serialPreference/selectors';
import HeartIcon from '../../svgs/HeartOutline.svg';
import { toFlatten } from '../../utils/array';
import Footer from '../base/Footer';
import { TabBar, TabMenuTypes } from '../base/LNB';
import { ResponsiveBooks } from '../base/Responsive';

class SerialPreference extends React.Component {
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
      isSelectedAllBooks,
      onClickSelectAllBooks: dispatchSelectAllBooks,
      onClickUnselectAllBooks: dispatchClearSelectedBooks,
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
    const {
      pageInfo: { currentPage, totalPages },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={URLMap.serialPreference.href}
        as={URLMap.serialPreference.as}
      />
    );
  }

  render() {
    const { isEditing } = this.state;

    return (
      <>
        <Head>
          <title>선호 작품 - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.SERIAL_PREFERENCE} />
        <Editable
          allowFixed
          isEditing={isEditing}
          nonEditBar={this.renderToolBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.makeActionBarProps()}
        >
          <main>{this.renderMain()}</main>
        </Editable>
        <Footer />
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const items = getItemsByPage(state);

  const seriesBookIds = toFlatten(items, 'series_id');

  const toUnitIdMap = getUnitIdsMap(state, seriesBookIds);
  const books = getBooks(state, [...seriesBookIds, ...toFlatten(items, 'recent_read_b_id')]);
  const totalCount = getTotalCount(state);
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  return {
    pageInfo,
    items,
    toUnitIdMap,
    books,
    totalCount,
    totalSelectedCount,
    isFetchingBooks,
    viewType: ViewType.LANDSCAPE,
  };
};

const mapDispatchToProps = {
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchDeleteSelectedBooks: deleteSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SerialPreference);
