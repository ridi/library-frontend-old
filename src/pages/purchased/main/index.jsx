/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ButtonType } from '../../../components/ActionBar/constants';
import BookDownLoader from '../../../components/BookDownLoader';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
import PageRedirect from '../../../components/PageRedirect';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SearchBar from '../../../components/SearchBar';
import SelectShelfModal from '../../../components/SelectShelfModal';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import * as featureIds from '../../../constants/featureIds';
import { ListInstructions } from '../../../constants/listInstructions';
import { OrderOptions } from '../../../constants/orderOptions';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import { getUnits } from '../../../services/book/selectors';
import * as featureSelectors from '../../../services/feature/selectors';
import { getRecentlyUpdatedData } from '../../../services/purchased/common/selectors';
import { downloadSelectedBooks, hideSelectedBooks, loadItems, selectAllBooks } from '../../../services/purchased/main/actions';
import {
  getFilterOptions,
  getIsFetchingBooks,
  getItemsByPage,
  getLastBookIdsByPage,
  getTotalPages,
  getUnitIdsByPage,
} from '../../../services/purchased/main/selectors';
import { clearSelectedItems } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import * as shelfActions from '../../../services/shelf/actions';
import BookOutline from '../../../svgs/BookOutline.svg';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';

function extractPageOptions(location) {
  const urlParams = new URLSearchParams(location.search);
  const currentPage = parseInt(urlParams.get('page'), 10) || 1;
  const orderType = urlParams.get('order_type') || OrderOptions.DEFAULT.orderType;
  const orderBy = urlParams.get('order_by') || OrderOptions.DEFAULT.orderBy;
  const categoryFilter = parseInt(urlParams.get('filter'), 10) || null;
  return { page: currentPage, orderType, orderBy, categoryFilter };
}

function useDispatchOptions(actionDispatcher, options) {
  const { page, orderType, orderBy, categoryFilter } = options;
  return React.useCallback(() => actionDispatcher(options), [actionDispatcher, page, orderType, orderBy, categoryFilter]);
}

function PurchasedMain(props) {
  const { listInstruction, location, totalPages } = props;
  const {
    dispatchAddSelectedToShelf,
    dispatchClearSelectedBooks,
    dispatchDownloadSelectedBooks,
    dispatchHideSelectedBooks,
    dispatchSelectAllBooks,
  } = props;

  const pageOptions = extractPageOptions(location);
  const { page: currentPage, orderType, orderBy, categoryFilter } = pageOptions;

  const [isEditing, setIsEditing] = React.useState(false);
  const [showShelves, setShowShelves] = React.useState(false);

  const dispatchDownloadSelectedBooksWithOptions = useDispatchOptions(dispatchDownloadSelectedBooks, pageOptions);
  const dispatchHideSelectedBooksWithOptions = useDispatchOptions(dispatchHideSelectedBooks, pageOptions);
  const dispatchSelectAllBooksWithOptions = useDispatchOptions(dispatchSelectAllBooks, pageOptions);

  const linkBuilder = React.useCallback(
    libraryBookData => {
      const order = OrderOptions.toKey(orderType, orderBy);

      const params = new URLSearchParams();
      if (OrderOptions.EXPIRE_DATE.key === order || OrderOptions.EXPIRED_BOOKS_ONLY.key === order) {
        params.append('order_type', orderType);
        params.append('order_by', orderBy);
      }
      const search = params.toString();

      // TODO: react-router 5.1 나오면 함수로 바꿀 것
      const to = {
        pathname: URLMap.mainUnit.as({ unitId: libraryBookData.unit_id }),
        search: search === '' ? '' : `?${search}`,
        state: {
          backLocation: location,
        },
      };

      return <Link to={to}>더보기</Link>;
    },
    [location, orderType, orderBy],
  );

  function renderPaginator() {
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} />;
  }

  function renderBooks() {
    const { items: libraryBookDTO, units, recentlyUpdatedMap, viewType } = props;

    if (listInstruction === ListInstructions.SKELETON) {
      return <SkeletonBooks viewType={viewType} />;
    }

    return (
      <>
        <Books
          {...{
            libraryBookDTO,
            units,
            isSelectMode: isEditing,
            viewType,
            linkBuilder,
            recentlyUpdatedMap,
          }}
        />
        {renderPaginator()}
      </>
    );
  }

  function getEmptyMessage() {
    const order = OrderOptions.toKey(orderType, orderBy);

    if (OrderOptions.EXPIRE_DATE.key === order) {
      return '대여 중인 도서가 없습니다.';
    }
    if (OrderOptions.EXPIRED_BOOKS_ONLY.key === order) {
      return '만료된 도서가 없습니다.';
    }

    return '구매/대여하신 책이 없습니다.';
  }

  function renderMain() {
    const { dispatchLoadItems, isError } = props;
    if (isError) {
      return <BookError onClickRefreshButton={dispatchLoadItems} />;
    }

    if (listInstruction === ListInstructions.EMPTY) {
      return <Empty IconComponent={BookOutline} message={getEmptyMessage()} />;
    }
    return <ResponsiveBooks>{renderBooks()}</ResponsiveBooks>;
  }

  const toggleEditingMode = React.useCallback(
    () => {
      if (isEditing) {
        dispatchClearSelectedBooks();
      }
      setIsEditing(!isEditing);
    },
    [dispatchClearSelectedBooks, isEditing],
  );
  function renderSearchBar() {
    const { filterOptions } = props;
    const order = OrderOptions.toKey(orderType, orderBy);
    const orderOptions = OrderOptions.toMainList();

    const searchBarProps = {
      filter: categoryFilter,
      filterOptions,
      order,
      orderOptions,
      orderBy,
      orderType,
      toggleEditingMode,
    };

    return <SearchBar {...searchBarProps} />;
  }

  function makeEditingBarProps() {
    const { isSyncShelfEnabled, items, totalSelectedCount } = props;
    const filteredItems = isSyncShelfEnabled ? items.filter(item => !UnitType.isCollection(item.unit_type)) : items;
    const isSelectedAllBooks = totalSelectedCount === filteredItems.length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: dispatchSelectAllBooksWithOptions,
      onClickUnselectAllItem: dispatchClearSelectedBooks,
      onClickSuccessButton: toggleEditingMode,
    };
  }

  const handleHideClick = React.useCallback(
    () => {
      dispatchHideSelectedBooksWithOptions();
      dispatchClearSelectedBooks();
      setIsEditing(false);
    },
    [dispatchClearSelectedBooks, dispatchHideSelectedBooksWithOptions],
  );
  const handleDownloadClick = React.useCallback(
    () => {
      dispatchDownloadSelectedBooksWithOptions();
      dispatchClearSelectedBooks();
      setIsEditing(false);
    },
    [dispatchClearSelectedBooks, dispatchDownloadSelectedBooksWithOptions],
  );
  const handleAddToShelf = React.useCallback(() => setShowShelves(true), []);
  const handleShelfBackClick = React.useCallback(() => setShowShelves(false), []);
  const handleShelfSelect = React.useCallback(
    uuid => {
      dispatchAddSelectedToShelf({
        uuid,
        onComplete: () => {
          setIsEditing(false);
          setShowShelves(false);
          dispatchClearSelectedBooks();
        },
      });
    },
    [dispatchAddSelectedToShelf, dispatchClearSelectedBooks],
  );

  function makeActionBarProps() {
    const { isSyncShelfEnabled, totalSelectedCount } = props;
    const disable = totalSelectedCount === 0;

    let buttonProps;
    if (isSyncShelfEnabled) {
      buttonProps = [
        {
          name: '숨기기',
          onClick: handleHideClick,
          disable,
        },
        {
          name: '책장에 추가',
          onClick: handleAddToShelf,
          disable,
        },
        {
          type: ButtonType.SPACER,
        },
        {
          name: '다운로드',
          onClick: handleDownloadClick,
          disable,
        },
      ];
    } else {
      buttonProps = [
        {
          name: '선택 숨기기',
          onClick: handleHideClick,
          disable,
        },
        {
          type: ButtonType.SPACER,
        },
        {
          name: '선택 다운로드',
          onClick: handleDownloadClick,
          disable,
        },
      ];
    }

    return { buttonProps };
  }

  if (showShelves) {
    return (
      <>
        <Helmet>
          <title>모든 책 - 내 서재</title>
        </Helmet>
        <PageRedirect currentPage={currentPage} totalPages={totalPages} />
        <SelectShelfModal onBackClick={handleShelfBackClick} onShelfSelect={handleShelfSelect} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>모든 책 - 내 서재</title>
      </Helmet>
      <PageRedirect currentPage={currentPage} totalPages={totalPages} />
      <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
      <Editable
        allowFixed
        isEditing={isEditing}
        nonEditBar={renderSearchBar()}
        editingBarProps={makeEditingBarProps()}
        actionBarProps={makeActionBarProps()}
      >
        <main>{renderMain()}</main>
      </Editable>
      <Footer />
      <BookDownLoader />
    </>
  );
}

PurchasedMain.prepare = async ({ dispatch, location, req }) => {
  const isServer = Boolean(req);

  const pageOptions = extractPageOptions(location);
  await dispatch(clearSelectedItems());
  await dispatch(loadItems(pageOptions, isServer));
};

const mapStateToProps = (state, props) => {
  const pageOptions = extractPageOptions(props.location);

  const totalPages = getTotalPages(state, pageOptions);
  const filterOptions = getFilterOptions(state);
  const items = getItemsByPage(state, pageOptions);
  const unitIds = getUnitIdsByPage(state, pageOptions);
  const units = getUnits(state, unitIds);
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);
  const lastBookIds = getLastBookIdsByPage(state, pageOptions);
  const recentlyUpdatedMap = getRecentlyUpdatedData(state, lastBookIds);
  const isSyncShelfEnabled = featureSelectors.getIsFeatureEnabled(state, featureIds.SYNC_SHELF);

  let listInstruction;
  if (items.length !== 0) {
    listInstruction = ListInstructions.SHOW;
  } else if (isFetchingBooks) {
    listInstruction = ListInstructions.SKELETON;
  } else {
    listInstruction = ListInstructions.EMPTY;
  }
  return {
    totalPages,
    filterOptions,
    items,
    units,
    recentlyUpdatedMap,
    totalSelectedCount,
    listInstruction,
    viewType: state.ui.viewType,
    isError: state.ui.isError,
    isSyncShelfEnabled,
  };
};

const mapDispatchToProps = {
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedItems,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
  dispatchAddSelectedToShelf: shelfActions.addSelectedToShelf,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PurchasedMain);
