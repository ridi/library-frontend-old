import { UnitType } from '../constants/unitType';

export const EmptyUnit = { title: '', type: UnitType.BOOK };

export const EmptySeries = {
  property: {
    is_serial_complete: true,
    opened_book_count: 1,
  },
  volume: 1,
};
