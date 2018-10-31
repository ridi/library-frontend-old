import { put } from 'redux-saga/effects';
import { getAPI } from '../../api/actions';

import config from '../../config';

import { makeTTL } from '../../utils/ttl';

const _reduceBooks = books => {
  const reducedBooks = books.map(book => ({
    id: book.id,
    title: book.title,
    file: book.file,
    thumbnail: book.thumbnail,
    property: book.property,
    authors: book.authors,
    series: book.series,
    setbook: book.setbook,

    // RSG Book Component에서 사용함
    categories: book.categories,
  }));

  return reducedBooks;
};

const _attatchTTL = books => {
  const ttl = makeTTL();
  return books.map(book => {
    book.ttl = ttl;
    return book;
  });
};

export function* fetchBookData(bookIds) {
  const api = yield put(getAPI());
  const response = yield api.get(
    `${config.PLATFORM_API_BASE_URL}/books?b_ids=${bookIds.join(',')}`,
  );

  return _attatchTTL(_reduceBooks(response.data));
}
