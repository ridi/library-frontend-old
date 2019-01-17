export class UnitType {
  static get BOOK() {
    return 'book';
  }

  static get SERIES() {
    return 'series';
  }

  static get SHELF() {
    return 'shelf';
  }

  static isBook(unitType) {
    return unitType === this.BOOK;
  }
}
