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

const extractCurrentPage = locationSearch => {
  const urlParams = new URLSearchParams(locationSearch);
  return parseInt(urlParams.get('page'), 10) || 1;
};

function useDispatchPage(actionDispatcher, page) {
  return React.useCallback(() => actionDispatcher(page), [actionDispatcher, page]);
}

function SerialPreference(props) {
  const { currentPage, items, totalSelectedCount } = props;
  const { dispatchClearSelectedBooks, dispatchDeleteSelectedBooks, dispatchSelectAllBooks } = props;
  const [isSelectMode, setIsSelectMode] = React.useState(false);

  const dispatchDeleteSelectedBooksWithPage = useDispatchPage(dispatchDeleteSelectedBooks, currentPage);
  const dispatchSelectAllBooksWithPage = useDispatchPage(dispatchSelectAllBooks, currentPage);

  const toggleEditingMode = React.useCallback(
    () => {
      if (isSelectMode) {
        dispatchClearSelectedBooks();
      }
      setIsSelectMode(!isSelectMode);
    },
    [dispatchClearSelectedBooks, isSelectMode],
  );

  const handleDeleteClick = React.useCallback(
    () => {
      dispatchDeleteSelectedBooksWithPage();
      dispatchClearSelectedBooks();
      setIsSelectMode(false);
    },
    [dispatchClearSelectedBooks, dispatchDeleteSelectedBooksWithPage],
  );

  function renderToolBar() {
    const { totalCount, isFetchingBooks } = props;

    const toolBarProps = {
      isFetchingBooks,
      totalCount,
      toggleEditingMode,
    };

    return <SerialPreferenceToolBar {...toolBarProps} />;
  }

  function renderPaginator() {
    const { totalCount } = props;
    const totalPages = calcPage(totalCount, SERIAL_PREFERENCE_ITEMS_LIMIT_PER_PAGE);
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} />;
  }

  function renderBooks() {
    const { toUnitIdMap, books: platformBookDTO, isFetchingBooks } = props;
    const showSkeleton = isFetchingBooks && items.length === 0;

    return showSkeleton ? (
      <SkeletonBooks viewType={ViewType.LANDSCAPE} />
    ) : (
      <>
        <SerialPreferenceBooks
          items={items}
          toUnitIdMap={toUnitIdMap}
          platformBookDTO={platformBookDTO}
          isSelectMode={isSelectMode}
          viewType={ViewType.LANDSCAPE}
        />
        {renderPaginator()}
      </>
    );
  }

  function renderMain() {
    const { isFetchingBooks } = props;

    if (!isFetchingBooks && items.length === 0) {
      return <Empty IconComponent={HeartIcon} iconWidth={44} message="등록하신 선호 작품이 없습니다." />;
    }

    return <ResponsiveBooks>{renderBooks()}</ResponsiveBooks>;
  }

  const selectModeBarProps = {
    totalSelectedCount,
    isSelectedAllItem: totalSelectedCount === items.length,
    onClickSelectAllItem: dispatchSelectAllBooksWithPage,
    onClickUnselectAllItem: dispatchClearSelectedBooks,
    onClickSuccessButton: toggleEditingMode,
  };

  const actionBarProps = {
    buttonProps: [
      {
        type: ButtonType.SPACER,
      },
      {
        name: '선택 삭제',
        type: ButtonType.DANGER,
        onClick: handleDeleteClick,
        disable: totalSelectedCount === 0,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>선호 작품 - 내 서재</title>
      </Helmet>
      <TabBar activeMenu={TabMenuTypes.SERIAL_PREFERENCE} />
      <Editable
        allowFixed
        isEditing={isSelectMode}
        nonEditBar={renderToolBar()}
        editingBarProps={selectModeBarProps}
        actionBarProps={actionBarProps}
      >
        <main>{renderMain()}</main>
        <Footer />
      </Editable>
    </>
  );
}

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
