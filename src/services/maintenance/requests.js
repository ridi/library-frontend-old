import axios from 'axios';
import config from '../../config';
import { isNowBetween } from '../../utils/datetime';
import { notifySentry } from '../../utils/sentry';
import { makeURI } from '../../utils/uri';

const maintenanceStatus = data => ({
  isShow: data ? isNowBetween(data.start, data.end) : false,
  terms: data ? data.terms : '',
  unavailableServiceList: data ? data.unavailableServiceList : [],
});

export const getMaintenanceStatus = () =>
  axios
    .get(makeURI('/static/maintenance.json', {}, config.STATIC_URL))
    .then(response => maintenanceStatus(response.data))
    .catch(error => {
      notifySentry(error);
      return maintenanceStatus();
    });
