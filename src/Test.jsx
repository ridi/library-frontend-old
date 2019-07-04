/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Books } from './components/Books';
import Empty from './components/Empty';
import ResponsivePaginator from './components/ResponsivePaginator';
import SkeletonBooks from './components/Skeleton/SkeletonBooks';
import * as featureIds from './constants/featureIds';
import { ListInstructions } from './constants/listInstructions';
import { OrderOptions } from './constants/orderOptions';
import { URLMap } from './constants/urls';
import { getUnits } from './services/book/selectors';
import * as featureSelectors from './services/feature/selectors';
import { getRecentlyUpdatedData } from './services/purchased/common/selectors';
import { downloadSelectedBooks, hideSelectedBooks, loadItems, selectAllBooks } from './services/purchased/main/actions';
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
} from './services/purchased/main/selectors';
import { clearSelectedItems } from './services/selection/actions';
import { getTotalSelectedCount } from './services/selection/selectors';
import * as shelfActions from './services/shelf/actions';
import BookOutline from './svgs/BookOutline.svg';
import Footer from './pages/base/Footer';
import { ResponsiveBooks } from './pages/base/Responsive';
import { makeLinkProps } from './utils/uri';

function Main(props) {
  const { listInstruction, location, totalPages } = props;

  const urlParams = new URLSearchParams(location.search);
  const currentPage = parseInt(urlParams.get('page'), 10) || 1;
  const orderType = urlParams.get('order_type') || OrderOptions.DEFAULT.orderType;
  const orderBy = urlParams.get('order_by') || OrderOptions.DEFAULT.orderBy;
  const categoryFilter = parseInt(urlParams.get('filter'), 10) || null;

  const realPage = Math.max(1, Math.min(totalPages, currentPage));

  const [isEditing, setIsEditing] = React.useState(false);
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
    if (listInstruction === ListInstructions.EMPTY) {
      return <Empty IconComponent={BookOutline} message={getEmptyMessage()} />;
    }
    return <ResponsiveBooks>{renderBooks()}</ResponsiveBooks>;
  }

  let redirection = null;
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

  return (
    <>
      <Helmet>
        <title>모든 책 - 내 서재</title>
      </Helmet>
      {redirection}
      {renderMain()}
      <Footer />
    </>
  );
}

Main.prepare = async ({ dispatch, location, req }) => {
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
)(Main);
