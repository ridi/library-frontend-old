import { HttpStatusCode } from '../../../api/constants';

import config from '../../../config';

import { calcOffset } from '../../../utils/pagination';
import { makeURI } from '../../../utils/uri';

import { getApi } from '../../../api';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';

export async function fetchSearchItems(keyword, page) {
  const options = {
    keyword,
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  const api = getApi();
  try {
    const response = await api.get(makeURI('/items/search/', options, config.LIBRARY_API_BASE_URL));
    return response.data;
  } catch (err) {
    if (err.response.status === HttpStatusCode.HTTP_400_BAD_REQUEST) {
      // 잘못된 Keyword는 별도의 에러핸들링이 아닌 Empty페이지 처리
      return { items: [] };
    }

    throw new Error('Unknown');
  }
}

export async function fetchSearchItemsTotalCount(keyword) {
  const options = {
    keyword,
  };

  const api = getApi();
  try {
    const response = await api.get(makeURI('/items/search/count/', options, config.LIBRARY_API_BASE_URL));
    return response.data;
  } catch (err) {
    if (err.response.status === HttpStatusCode.HTTP_400_BAD_REQUEST) {
      // 잘못된 Keyword는 별도의 에러핸들링이 아닌 Empty페이지 처리
      return {
        unit_total_count: 0,
        item_total_count: 0,
      };
    }

    throw new Error('Unknown');
  }
}
