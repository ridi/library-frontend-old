import { captureMessage } from '@sentry/browser';
import { put } from 'redux-saga/effects';
import { getApi } from '../../api';
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
    title: book.title,
    file: book.file,
    thumbnail: book.thumbnail,
    property: book.property,
    authors: book.authors,
    series: book.series,
    setbook: book.setbook,
    support: {
      web_viewer: book.support.web_viewer,
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
  const response = yield api.get(makeURI('/books', { b_ids: bookIds.join(',') }, config.BOOK_API_BASE_URL));

  const idSet = new Set(response.data.map(book => book.id));
  for (const bookId of bookIds) {
    if (!idSet.has(bookId)) {
      console.error('Book requested but does not exist:', bookId);
      captureMessage('Book requested but does not exist', {
        extra: { bookId },
      });
    }
  }

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
  const api = getApi();
  const response = await api.post(makeURI(`/items`, {}, config.LIBRARY_API_BASE_URL), options);
  return response.data;
}

export async function fetchLibraryUnitData(unitIds) {
  const api = getApi();
  const promises = unitIds.map(async unitId => {
    const [detailResponse, countResponse] = await Promise.all([
      api.get(makeURI(`/items/search/${unitId}/`, { offset: 0, limit: 1 }, config.LIBRARY_API_BASE_URL)),
      api.get(makeURI(`/items/search/${unitId}/count/`, {}, config.LIBRARY_API_BASE_URL)),
    ]);
    const unitDetail = detailResponse.data.unit;
    const bookDetail = detailResponse.data.items[0];
    return {
      unit_count: countResponse.data.item_total_count,
      remain_time: bookDetail.remain_time,
      expire_date: bookDetail.expire_date,
      is_ridiselect: bookDetail.is_ridiselect,
      unit_type: unitDetail.type,
      unit_title: unitDetail.title,
      b_id: bookDetail.b_id,
      purchase_date: bookDetail.purchase_date,
      unit_id: unitDetail.id,
    };
  });
  return Promise.all(promises);
}
