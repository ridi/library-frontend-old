/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import * as featureIds from './constants/featureIds';
import { ListInstructions } from './constants/listInstructions';
import { OrderOptions } from './constants/orderOptions';
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
import Footer from './pages/base/Footer';

class Main extends React.PureComponent {
  static async prepare({ dispatch, params, req }) {
    const isServer = Boolean(req);

    const currentPage = parseInt(params.page, 10) || 1;
    const { order_type: orderType = OrderOptions.DEFAULT.orderType, order_by: orderBy = OrderOptions.DEFAULT.orderBy } = params;
    const categoryFilter = parseInt(params.filter, 10) || null;

    const args = { currentPage, orderType, orderBy, categoryFilter };
    await dispatch(clearSelectedItems());
    await dispatch(loadItems(args, isServer));
  }

  render() {
    return (
      <>
        <Helmet>
          <title>모든 책 - 내 서재</title>
        </Helmet>
        {this.props.items.length <= 0 && this.props.totalPages > 0 && null}
        <Footer />
      </>
    );
  }
}

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
