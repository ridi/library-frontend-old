export default class Genre {
  static get COMIC() {
    return 'comic';
  }

  static get FANTASY() {
    return 'fantasy';
  }

  static get ROMANCE() {
    return 'romance';
  }

  static get GENERAL() {
    return 'general';
  }

  static get BL() {
    return 'bl';
  }

  static convertToString(key) {
    const stringMap = {
      [this.COMIC]: '만화',
      [this.FANTASY]: '판타지',
      [this.ROMANCE]: '로맨스',
      [this.GENERAL]: '일반',
      [this.BL]: 'BL',
    };
    return stringMap[key];
  }
}
