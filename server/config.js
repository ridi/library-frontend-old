import { Configure } from '../src/constants/configure';

const fileSystem = require('fs');
const secrets = JSON.parse(fileSystem.readFileSync('secrets.json', 'utf8'));

module.exports = {
  ENVIRONMENT: secrets[Configure.ENVIRONMENT],

  RIDI_TOKEN_AUTHORIZE_URL: secrets[Configure.RIDI_TOKEN_AUTHORIZE_URL],
  RIDI_OAUTH2_CLIENT_ID: secrets[Configure.RIDI_OAUTH2_CLIENT_ID],

  RIDI_OAUTH2_JWT_SECRET: secrets[Configure.RIDI_OAUTH2_JWT_SECRET],
};
