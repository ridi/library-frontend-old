import axios from 'axios';
import config from '../../config';
import { isNowBetween } from '../../utils/datetime';
import { notifySentry } from '../../utils/sentry';

const maintenanceStatus = (visible = false, terms = '', unavailableServiceList = []) => ({
  visible,
  terms,
  unavailableServiceList,
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
  return sorryRidibooksStatus;
};
