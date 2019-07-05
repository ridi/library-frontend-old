import axios from 'axios';
import { isNowBetween } from '../../utils/datetime';
import { notifySentry } from '../../utils/sentry';
import { makeURI } from '../../utils/uri';

import maintenanceUrl from '../../static/maintenance.json';

const maintenanceStatus = data => ({
  isShow: data ? isNowBetween(new Date(data.start), new Date(data.end)) : false,
  terms: data ? data.terms : '',
  unavailableServiceList: data ? data.unavailableServiceList : [],
});

export const getMaintenanceStatus = () =>
  axios
    .get(makeURI(maintenanceUrl, {}))
    .then(response => maintenanceStatus(response.data))
    .catch(error => {
      notifySentry(error);
      return maintenanceStatus();
    });
