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
    /** 사내에서 커뮤니케이션시 '콜렉션 도서' 라고 부르는 도서들의 type 이
     * dev 에서는 'shelf', 'collection' 이 섞여있고 production 에서는 'shelf' 만 넘어옴.
     * 19.05.17 현재 테섭에서도 'shelf' 만 넘겨 주도록 계정팀에서 보정 중
     * TODO : 보정 완료 후 COLLECTION 제거 및 주석 수정 */
    return unitType === this.SHELF || unitType === this.COLLECTION;
  }

  static isSeries(unitType) {
    return unitType === this.SERIES;
  }
}
