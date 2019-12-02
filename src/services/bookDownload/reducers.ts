import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';

interface BookdownloadState {
  src: null | string;
}

const bookDownloadState: BookdownloadState = {
  src: null,
};

export type BookIds = string[];

export class BookDownloadReducer extends ImmerReducer<BookdownloadState> {
  public downloadBooks(bookIds: BookIds) {}
  public downloadSelectedBooks() {}
  public downloadBooksByUnitIds(unidIds: BookIds) {}

  public setBookDownloadSrc(payload: BookdownloadState) {
    this.draftState.src = payload.src;
  }
}

export const bookDownloadReducer = createReducerFunction(BookDownloadReducer, bookDownloadState);
export const bookDownloadActions = createActionCreators(BookDownloadReducer);
