export const SET_MAINTENANCE = 'SET_MAINTENANCE';

export const setMaintenance = ({ visible, terms, unavailableServiceList }) => ({
  type: SET_MAINTENANCE,
  payload: {
    visible,
    terms,
    unavailableServiceList,
  },
});
