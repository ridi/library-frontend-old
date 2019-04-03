export const SET_MAINTENANCE = 'SET_MAINTENANCE';

export const setMaintenance = ({ isShow, terms, unavailableServiceList }) => ({
  type: SET_MAINTENANCE,
  payload: {
    isShow,
    terms,
    unavailableServiceList,
  },
});
