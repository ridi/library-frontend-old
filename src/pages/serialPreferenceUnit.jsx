/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import { URLMap, PageType } from '../constants/urls';
import { getBooks, getUnit, getBookStarRating, getBookDescription } from '../services/book/selectors';
import { getPageInfo as getSerialPrefPageInfo } from '../services/serialPreference/selectors';
import { downloadSelectedBooks, hideSelectedBooks, loadItems, selectAllBooks, setUnitId } from '../services/purchased/mainUnit/actions';
import { clearSelectedBooks } from '../services/selection/actions';
import {
  getIsFetchingBook,
  getPageInfo,
  getTotalCount,
  getUnitId,
  getItemsByPage,
  getPrimaryItem,
} from '../services/purchased/mainUnit/selectors';
import { toFlatten } from '../utils/array';
import { getPrimaryBookId } from '../services/purchased/common/selectors';
import UnitPageTemplate from './base/UnitPageTemplate';

class SerialPreferenceUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(clearSelectedBooks());
    await store.dispatch(loadItems());
  }

  render() {
    return <UnitPageTemplate {...this.props} />;
  }
}

const mapStateToProps = state => {
  const unitId = getUnitId(state);
  const unit = getUnit(state, unitId);
  const primaryBookId = getPrimaryBookId(state, unitId);
  const primaryItem = getPrimaryItem(state);
  const items = getItemsByPage(state);

  const books = getBooks(state, [...toFlatten(items, 'b_id'), primaryBookId]);
  const bookDescription = getBookDescription(state, primaryBookId);
  const bookStarRating = getBookStarRating(state, primaryBookId);

  const totalCount = getTotalCount(state);

  const isFetchingBook = getIsFetchingBook(state);

  const pageInfo = getPageInfo(state);
  const serialPrefPageInfo = getSerialPrefPageInfo(state);

  return {
    items,
    unitId,
    unit,
    primaryBookId,
    primaryItem,
    books,
    bookDescription,
    bookStarRating,
    totalCount,
    isFetchingBook,

    pageInfo,
    serialPrefPageInfo,

    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

const mergeProps = (state, actions, props) => {
  const {
    unitId,
    pageInfo: { currentPage, totalPages, orderType, orderBy },
    serialPrefPageInfo,
  } = state;
  const pageProps = {
    currentPage,
    totalPages,
    href: { pathname: URLMap[PageType.SERIAL_PREFERENCE_UNIT].href, query: { unitId } },
    as: URLMap[PageType.SERIAL_PREFERENCE_UNIT].as({ unitId }),
    query: { orderType, orderBy },
  };

  const backPageProps = {
    href: URLMap[PageType.SERIAL_PREFERENCE].href,
    as: URLMap[PageType.SERIAL_PREFERENCE].as,
    query: { page: serialPrefPageInfo.currentPage },
  };

  return {
    ...state,
    ...actions,
    ...props,
    pageProps,
    backPageProps,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(SerialPreferenceUnit);
