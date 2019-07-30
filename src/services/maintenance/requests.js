import axios from 'axios';
import config from '../../config';
import { isNowBetween } from '../../utils/datetime';
import { notifySentry } from '../../utils/sentry';
import { makeURI } from '../../utils/uri';

const maintenanceStatus = (isShow = false, terms = '', unavailableServiceList = []) => ({
  isShow,
  terms,
  unavailableServiceList,
});

export const getStaticMaintenanceStatus = () =>
  axios
    .get(makeURI('/static/maintenance.json', {}, config.STATIC_URL))
    .then(({ data }) => {
      const { start, end, terms, unavailableServiceList } = data;
      return data ? maintenanceStatus(isNowBetween(new Date(start), new Date(end)), terms, unavailableServiceList) : maintenanceStatus();
    })
    .catch(error => {
      notifySentry(error);
      return maintenanceStatus();
    });

export const getSorryRidibooksStatus = () =>
  axios
    .get('https://sorry.ridibooks.com/status')
    .then(({ data }) => {
      const { status, period, unavailableService } = data;
      return data ? maintenanceStatus(status === 'maintenance', period, unavailableService) : maintenanceStatus();
    })
    .catch(error => {
      notifySentry(error);
      return maintenanceStatus();
    });

export const getMaintenanceStatus = async () => {
  const sorryRidibooksStatus = await getSorryRidibooksStatus();
  if (sorryRidibooksStatus.isShow) {
    return sorryRidibooksStatus;
  }

  const staticMaintenanceStatus = await getStaticMaintenanceStatus();
  return staticMaintenanceStatus;
};
