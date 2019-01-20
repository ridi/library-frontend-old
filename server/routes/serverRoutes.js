import API from '../../src/api/api';

import { makeURI } from '../../src/utils/uri';
import config from '../config';
import { AuthList } from '../lib/internalServerAuth/constants';
import { makeInternalServerAuthReqToken } from '../lib/internalServerAuth/internalServerAuthHelper';

// TODO: removeView 말고 다른게 추가되면 구조를 고민해야 한다.
export function removeView(req, res) {
  const bookIds = req.body.b_ids;
  const userIdx = req.user.idx;
  const options = {
    b_ids: bookIds,
    u_idx: userIdx,
  };

  const api = new API({
    headers: {
      Authorization: makeInternalServerAuthReqToken(AuthList.STORE),
    },
  });

  api
    .delete(makeURI('/api/library/books', options, config.STORE_API_BASE_URL))
    .then(() => {
      // TODO: 현재 API 가 배포되지 않았다. 당분간 아래와 같이 처리 한다.
      res.send([
        {
          id: 22,
        },
        {
          id: 23,
        },
      ]);
    })
    .catch(err => {
      console.log(err);
    });
}
