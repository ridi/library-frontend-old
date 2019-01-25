import * as jwt from 'jsonwebtoken';
import { AuthList } from './constants';

const config = require('../../config');

const privateKeys = {};
privateKeys[AuthList.STORE] = config.RIDI_INTERNAL_AUTH_LIBRARY_WEB_TO_STORE.replace(/\\n/gi, '\n');

export const makeInternalServerAuthReqToken = aud => {
  const token = jwt.sign(
    {
      iss: AuthList.LIBRARY_WEB,
      aud,
    },
    privateKeys[aud],
    { algorithm: 'RS256' },
  );
  return `Bearer ${token}`;
};
