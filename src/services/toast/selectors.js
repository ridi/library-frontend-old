import { createSelector } from 'reselect';

const getToastState = state => state.toast;

export const getToast = createSelector(getToastState, toastState => toastState.toast);
