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
    .then(result => {
      res.send(result.data.queue_ids.map(x => ({ id: x })));
    })
    .catch(err => {
      console.log(err);
    });
}
