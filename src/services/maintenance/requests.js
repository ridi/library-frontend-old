import axios from 'axios';
import config from '../../config';
import { isNowBetween } from '../../utils/datetime';
import { notifySentry } from '../../utils/sentry';
import { makeURI } from '../../utils/uri';

const maintenanceStatus = (visible = false, terms = '', unavailableServiceList = []) => ({
  visible,
  terms,
  unavailableServiceList,
});

export const getStaticMaintenanceStatus = () =>
  axios
    .get(makeURI('/static/maintenance.json', {}, config.STATIC_URL))
    .then(({ data }) => {
      const { start, end, terms, unavailableServiceList } = data;
      let visible = null;
      if (start && end) {
        visible = isNowBetween(new Date(start), new Date(end));
      }
      return maintenanceStatus(visible, terms, unavailableServiceList);
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
      return maintenanceStatus(status === 'maintenance', period, unavailableService);
    })
    .catch(error => {
      notifySentry(error);
      return maintenanceStatus();
    });

export const getMaintenanceStatus = async () => {
  const sorryRidibooksStatus = await getSorryRidibooksStatus();
  if (sorryRidibooksStatus.visible) {
    return sorryRidibooksStatus;
  }

  const staticMaintenanceStatus = await getStaticMaintenanceStatus();
  return staticMaintenanceStatus;
};
