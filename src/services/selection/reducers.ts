import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';

interface SelectionState {
  ids: any;
  shelfUuids: any;
}

const selectionState: SelectionState = {
  ids: {},
  shelfUuids: {},
};

export class SelectionReducer extends ImmerReducer<SelectionState> {
  setSelect(stateKey, ids, isSelect) {
    ids.forEach(id => {
      this.draftState[stateKey][id] = isSelect;
    });
  }

  toggle(stateKey, id) {
    if (!!this.draftState[stateKey][id]) {
      delete this.draftState[stateKey][id];
    } else {
      this.draftState[stateKey][id] = true;
    }
  }

  clear(stateKey) {
    if (Object.keys(this.draftState[stateKey]).length !== 0) {
      this.draftState[stateKey] = {};
    }
  }

  public selectItems(ids) {
    this.setSelect('ids', ids, true);
  }
  public deselectItems(ids) {
    this.setSelect('ids', ids, false);
  }
  public toggleItem(id) {
    this.toggle('ids', id);
  }
  public clearSelectedItems() {
    this.clear('ids');
  }
  public selectShelves(uuids) {
    this.setSelect('shelfUuids', uuids, true);
  }
  public deselectShelves(uuids) {
    this.setSelect('shelfUuids', uuids, false);
  }
  public toggleShelf(uuid) {
    this.toggle('shelfUuids', uuid);
  }
  public clearSelectedShelves() {
    this.clear('shelfUuids');
  }
}

export const selectionReducer = createReducerFunction(SelectionReducer, selectionState);
export const selectionActions = createActionCreators(SelectionReducer);
