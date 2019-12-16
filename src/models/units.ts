import { types } from 'mobx-state-tree';
import * as R from 'runtypes';

import { UnitType } from 'constants/unitType';

export const RUnitData = R.Record({
  id: R.Number,
  title: R.String,
  type: R.String,
  total_count: R.Number,
  file_size: R.Number,
  character_count: R.Number,
  page_count: R.Number,
});

export interface UnitData extends R.Static<typeof RUnitData> {}

export const Unit = types
  .model({
    id: types.identifierNumber,
    data: types.frozen<UnitData>(),
  })
  .views(self => ({
    get title() {
      return self.data.title;
    },
    get type() {
      return self.data.type;
    },
    get isBook() {
      return UnitType.isBook(self.data.type);
    },
  }));
