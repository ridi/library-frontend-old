import { put } from 'redux-saga/effects';
import { getAPI } from '../../api/actions';

import config from '../../config';

import { attatchTTL } from '../../utils/ttl';
import { makeURI } from '../../utils/uri';

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
  }));

const _reduceBookDescriptions = bookDescriptions =>
  bookDescriptions.map(bookDescription => ({
    id: bookDescription.b_id,
    intro: bookDescription.descriptions.intro.replace('\r\n', '\n').replace('\n', ''),
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
