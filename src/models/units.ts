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
    data: types.custom<object, UnitData & { $instance: true }>({
      name: 'UnitData',
      fromSnapshot(snapshot) {
        return {
          ...(snapshot as UnitData),
          $instance: true,
        };
      },
      toSnapshot(value) {
        const snapshot = { ...value };
        delete snapshot['$instance'];
        return snapshot;
      },
      isTargetType(value) {
        return '$instance' in value;
      },
      getValidationMessage(snapshot) {
        const validationResult = RUnitData.validate(snapshot);
        if (validationResult.success === true) {
          return '';
        }
        if (validationResult.key != null) {
          return `At ${validationResult.key}: ${validationResult.message}`;
        }
        return validationResult.message;
      },
    }),
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
