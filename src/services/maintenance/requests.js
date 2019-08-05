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
      const maintenanceData = data || {};
      const { start, end, terms, unavailableServiceList } = maintenanceData;
      const visible = Boolean(start && end) && isNowBetween(new Date(start), new Date(end));
      return maintenanceStatus(visible, terms, unavailableServiceList);
    })
    .catch(error => {
      notifySentry(error);
      return maintenanceStatus();
    });

export const getSorryRidibooksStatus = () =>
  axios
    .get(config.RIDI_STATUS_URL)
    .then(({ data }) => {
      const maintenanceData = data || {};
      const { status, start_at: start, end_at: end, period, unavailableService } = maintenanceData;
      const visible = start && end ? isNowBetween(new Date(start), new Date(end)) : status === 'maintenance';
      return maintenanceStatus(visible, period, unavailableService);
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
