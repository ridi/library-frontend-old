export class UnitType {
  static get BOOK() {
    return 'book';
  }

  static get COLLECTION() {
    return 'collection';
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

  static isCollection(unitType) {
    return unitType === this.SHELF || unitType === this.COLLECTION;
  }

  static isSeries(unitType) {
    return unitType === this.SERIES;
  }
}
