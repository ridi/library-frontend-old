/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { ButtonType } from '../../../components/ActionBar/constants';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
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
  getFilter,
  getFilterOptions,
  getIsFetchingBooks,
  getItemsByPage,
  getLastBookIdsByPage,
  getOrder,
  getPage,
  getTotalPages,
  getUnitIdsByPage,
} from '../../../services/purchased/main/selectors';
import { clearSelectedItems } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import * as shelfActions from '../../../services/shelf/actions';
import BookOutline from '../../../svgs/BookOutline.svg';
import { makeLinkProps } from '../../../utils/uri';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';

function PurchasedMain(props) {
  const { listInstruction, location, totalPages } = props;
  const { dispatchAddSelectedToShelf, dispatchDownloadSelectedBooks, dispatchClearSelectedBooks, dispatchHideSelectedBooks } = props;

  const urlParams = new URLSearchParams(location.search);
  const currentPage = parseInt(urlParams.get('page'), 10) || 1;
  const orderType = urlParams.get('order_type') || OrderOptions.DEFAULT.orderType;
  const orderBy = urlParams.get('order_by') || OrderOptions.DEFAULT.orderBy;
  const categoryFilter = parseInt(urlParams.get('filter'), 10) || null;

  const [isEditing, setIsEditing] = React.useState(false);
  const [showShelves, setShowShelves] = React.useState(false);

  const linkBuilder = React.useCallback(
    libraryBookData => {
      const order = OrderOptions.toKey(orderType, orderBy);

      const query = {};
      if (OrderOptions.EXPIRE_DATE.key === order || OrderOptions.EXPIRED_BOOKS_ONLY.key === order) {
        query.orderType = orderType;
        query.orderBy = orderBy;
      }

      const linkProps = makeLinkProps({}, URLMap.mainUnit.as({ unitId: libraryBookData.unit_id }), query);

      return <Link {...linkProps}>더보기</Link>;
    },
    [orderType, orderBy],
  );

  function renderPaginator() {
    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        as={URLMap.main.as}
        query={{ orderType, orderBy, filter: categoryFilter }}
      />
    );
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
    const { isSyncShelfEnabled, items, totalSelectedCount, dispatchSelectAllBooks } = props;
    const filteredItems = isSyncShelfEnabled ? items.filter(item => !UnitType.isCollection(item.unit_type)) : items;
    const isSelectedAllBooks = totalSelectedCount === filteredItems.length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: dispatchSelectAllBooks,
      onClickUnselectAllItem: dispatchClearSelectedBooks,
      onClickSuccessButton: toggleEditingMode,
    };
  }

  const handleHideClick = React.useCallback(
    () => {
      dispatchHideSelectedBooks();
      dispatchClearSelectedBooks();
      setIsEditing(false);
    },
    [dispatchClearSelectedBooks, dispatchHideSelectedBooks],
  );
  const handleDownloadClick = React.useCallback(
    () => {
      dispatchDownloadSelectedBooks();
      dispatchClearSelectedBooks();
      setIsEditing(false);
    },
    [dispatchClearSelectedBooks, dispatchDownloadSelectedBooks],
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

  let redirection = null;
  if (totalPages > 0) {
    const realPage = Math.max(1, Math.min(totalPages, currentPage));
    if (currentPage !== realPage) {
      const newUrlParams = new URLSearchParams(location.search);
      newUrlParams.set('page', realPage);
      const newSearch = newUrlParams.toString();
      const to = {
        ...location,
        search: newSearch !== '' ? `?${newSearch}` : '',
      };
      redirection = <Redirect to={to} />;
    }
  }

  if (showShelves) {
    return (
      <>
        <Helmet>
          <title>모든 책 - 내 서재</title>
        </Helmet>
        {redirection}
        <SelectShelfModal onBackClick={handleShelfBackClick} onShelfSelect={handleShelfSelect} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>모든 책 - 내 서재</title>
      </Helmet>
      {redirection}
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
    </>
  );
}

PurchasedMain.prepare = async ({ dispatch, location, req }) => {
  const isServer = Boolean(req);

  const urlParams = new URLSearchParams(location.search);
  const currentPage = parseInt(urlParams.get('page'), 10) || 1;
  const orderType = urlParams.get('order_type') || OrderOptions.DEFAULT.orderType;
  const orderBy = urlParams.get('order_by') || OrderOptions.DEFAULT.orderBy;
  const categoryFilter = parseInt(urlParams.get('filter'), 10) || null;

  const args = { currentPage, orderType, orderBy, categoryFilter };
  await dispatch(clearSelectedItems());
  await dispatch(loadItems(args, isServer));
};

const mapStateToProps = state => {
  const currentPage = getPage(state);
  const order = getOrder(state);
  const { orderType, orderBy } = OrderOptions.parse(order);
  const categoryFilter = getFilter(state);
  const totalPages = getTotalPages(state);
  const filterOptions = getFilterOptions(state);
  const items = getItemsByPage(state);
  const unitIds = getUnitIdsByPage(state);
  const units = getUnits(state, unitIds);
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);
  const lastBookIds = getLastBookIdsByPage(state);
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
    currentPage,
    orderType,
    orderBy,
    categoryFilter,
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
