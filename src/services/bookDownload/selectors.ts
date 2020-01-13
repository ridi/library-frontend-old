import { createSelector } from 'reselect';

const getState = state => state.bookDownload;

export const getBookDownloadSrc = createSelector(getState, state => state.src);
