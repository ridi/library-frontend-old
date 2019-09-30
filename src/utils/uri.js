import { stringify } from 'qs';
import config from '../config';
import { snakelize } from './snakelize';

export const makeURI = (pathname, query = {}, baseHost = null) => {
  // IE11 버그로 get 요청 캐싱 무마하기위해 t 시간값을 매 요청마다 추가
  const _query = snakelize({ ...query, t: +new Date() });
  const path = `${pathname}?${stringify(_query, { skipNulls: true })}`;

  if (baseHost) {
    return new URL(path, baseHost);
  }

  return path;
};

export const convertUriToAndroidIntentUri = (uri, packageName) => {
  // 앱 호출 URI를 안드로이드 intent를 이용해 호출할 수 있는 URI로 변환해주는 함수
  const scheme = /(.+):\/\//.exec(uri)[1];

  /* 줄바꿈시 공백이 들어가서 다운로드 URI 오류 발생 */
  return `${uri.replace(
    `${scheme}://`,
    'intent://',
  )}#Intent;scheme=${scheme};action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=${packageName};end`;
};

// 개발용 웹뷰어가 없기 때문에 도메인을 고정한다.
export const makeWebViewerUri = (bookId, currentUri) => {
  const webViewerBaseUrl = new URL(`books/${bookId}`, 'https://view.ridibooks.com');
  webViewerBaseUrl.searchParams.set('referrer', currentUri);
  return webViewerBaseUrl.toString();
};

export const makeRidiSelectUri = bookId => new URL(`book/${bookId}`, config.SELECT_BASE_URL).toString();

export const makeRidiStoreUri = bookId => {
  const storeBaseUrl = new URL('v2/Detail', config.STORE_BASE_URL);
  storeBaseUrl.searchParams.set('id', bookId);
  return storeBaseUrl.toString();
};

export const makeLinkProps = (href, as, query) => {
  const snakeQuery = typeof query === 'object' ? snakelize(query) : {};
  const searchParams = new URLSearchParams();
  for (const [k, v] of Object.entries(snakeQuery).filter(([, x]) => x != null)) {
    searchParams.append(k, v);
  }
  if (typeof as.query === 'object') {
    for (const [k, v] of Object.entries(snakelize(as.query)).filter(([, x]) => x != null)) {
      searchParams.append(k, v);
    }
  }
  const search = searchParams.toString();

  const to = {
    pathname: as.pathname || as,
    search: search !== '' ? `?${search}` : '',
  };

  return { to };
};
