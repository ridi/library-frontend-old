import { captureMessage } from '@sentry/browser';
import { stringify } from 'qs';
import { put } from 'redux-saga/effects';
import { getApi as getApiSingleton } from '../../api';
import { getAPI } from '../../api/actions';

import config from '../../config';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../constants/page';
import { calcOffset } from '../../utils/pagination';

import { attatchTTL } from '../../utils/ttl';
import { makeURI } from '../../utils/uri';
import { OrderOptions } from '../../constants/orderOptions';

const _reduceBooks = books =>
  books.map(book => ({
    id: book.id,
    isDeleted: book.is_deleted,
    title: book.title,
    file: book.file,
    thumbnail: book.thumbnail,
    property: book.property,
    authors: book.authors,
    series: book.series,
    setbook: book.setbook,
    support: {
      web_viewer: book.support && book.support.web_viewer,
    },
    // RSG Book Component에서 사용함
    categories: book.categories,
    publish: book.publish,
  }));

const _reduceBookDescriptions = bookDescriptions =>
  bookDescriptions.map(bookDescription => ({
    id: bookDescription.b_id,
    intro: bookDescription.descriptions.intro,
  }));

const _reduceBookStarRatings = bookStarRatings =>
  bookStarRatings.map(bookStarRating => ({
    id: bookStarRating.book_id,
    buyer_rating_score: bookStarRating.buyer_rating_score,
    buyer_rating_count: bookStarRating.buyer_rating_count,
  }));

export function* fetchBookData(bookIds) {
  const api = yield put(getAPI());
  const response = yield api.post(makeURI('/books', {}, config.BOOK_API_BASE_URL), stringify({ b_ids: bookIds.join(',') }));

  const idSet = new Set(response.data.map(book => book.id));
  bookIds.forEach(bookId => {
    if (!idSet.has(bookId)) {
      console.error('Book requested but does not exist:', bookId);
      captureMessage('Book requested but does not exist', {
        extra: { bookId },
      });
    }
  });

  return attatchTTL(_reduceBooks(response.data));
}

export function* fetchBookDescriptions(bookIds) {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/books/descriptions', { b_ids: bookIds.join(',') }, config.BOOK_API_BASE_URL));
  return attatchTTL(_reduceBookDescriptions(response.data));
}

export function* fetchStarRatings(bookIds) {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/api/ratings', { b_ids: bookIds.join(',') }, config.STORE_API_BASE_URL));

  return attatchTTL(_reduceBookStarRatings(response.data.rating_summaries));
}

export function* fetchUnitData(unitIds) {
  const api = yield put(getAPI());
  const response = yield api.post(makeURI('/books/units', {}, config.LIBRARY_API_BASE_URL), { unit_ids: unitIds });
  return attatchTTL(response.data.units);
}

export function* fetchUnitOrders(unitId, orderType, orderBy, page) {
  const options = {
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
    orderType,
    orderBy,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/books/units/${unitId}/order`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchPrimaryBookId(unitId) {
  const options = {
    offset: 0,
    limit: 1,
    orderType: OrderOptions.UNIT_LIST_DEFAULT.orderType,
    orderBy: OrderOptions.UNIT_LIST_DEFAULT.orderBy,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/books/units/${unitId}/order`, options, config.LIBRARY_API_BASE_URL));
  return response.data.items[0].b_ids[0];
}

export function* fetchUnitIdMap(bookIds) {
  const data = {
    b_ids: bookIds,
  };

  const api = yield put(getAPI());
  const response = yield api.post(makeURI('/books/units/ids', null, config.LIBRARY_API_BASE_URL), data);
  return response.data;
}

export async function fetchLibraryBookData(bookIds) {
  const options = {
    b_ids: bookIds,
  };
  const api = getApiSingleton();
  const response = await api.post(makeURI(`/items`, {}, config.LIBRARY_API_BASE_URL), options);
  return response.data;
}

export async function fetchLibraryUnitData(units) {
  if (units.length === 0) {
    return [];
  }
  const api = getApiSingleton();
  const unitIds = units.map(({ unitId }) => unitId);
  const itemResponse = await api.post(makeURI('/items/units/', {}, config.LIBRARY_API_BASE_URL), { unit_ids: unitIds });
  const itemResponseMap = new Map(itemResponse.data.items.map(item => [String(item.unit_id), item]));
  const unitsNeedFetch = units.filter(({ unitId }) => !itemResponseMap.has(String(unitId))).map(({ unitId }) => unitId);
  let unitResponseMap = new Map();
  if (unitsNeedFetch.length > 0) {
    const unitResponse = await api.post(makeURI('/books/units/', {}, config.LIBRARY_API_BASE_URL), { unit_ids: unitsNeedFetch });
    unitResponseMap = new Map(unitResponse.data.units.map(unit => [String(unit.id), unit]));
  }

  const result = units
    .filter(({ unitId }) => {
      const unitIdStr = String(unitId);
      return itemResponseMap.get(unitIdStr) != null || unitResponseMap.get(unitIdStr) != null;
    })
    .map(({ unitId, fallbackBookId }) => {
      const unitIdStr = String(unitId);
      const bookDetail = itemResponseMap.get(unitIdStr);
      if (bookDetail != null) {
        return bookDetail;
      }
      const unit = unitResponseMap.get(unitIdStr);
      return {
        remain_time: '',
        expire_date: '9999-12-31T23:59:59+09:00',
        is_ridiselect: false,
        b_id: fallbackBookId || '',
        purchase_date: new Date(0).toISOString(),
        unit_id: unitIdStr,
        unit_type: unit.type,
        unit_title: unit.title,
        unit_count: unit.total_count,
      };
    });
  const unitIdSet = new Set(result.map(({ unit_id: unitId }) => unitId));
  unitIds.forEach(unitId => {
    const unitIdStr = String(unitId);
    if (!unitIdSet.has(unitIdStr)) {
      console.error('Unit requested but does not exist:', unitIdStr);
      captureMessage('Unit requested but does not exist', {
        extra: { unitId: unitIdStr },
      });
    }
  });
  return result;
}
