import axios from 'axios';
import config from '../../config';
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
      const { status, period, unavailableService } = maintenanceData;
      const visible = status === 'maintenance';
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
