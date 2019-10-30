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

  static isCollection(unitType) {
    // 사내에서 커뮤니케이션시 '콜렉션 도서' 라고 부르는 도서들의 type 이 'shelf' 로 넘어옴.
    return unitType === this.SHELF;
  }

  static isSeries(unitType) {
    return unitType === this.SERIES;
  }
}
