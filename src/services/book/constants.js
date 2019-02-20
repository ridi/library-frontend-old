export class BookFileType {
  static get EPUB() {
    return 'epub';
  }

  static get BOM() {
    return 'bom';
  }

  static get PDF() {
    return 'pdf';
  }

  static get WEBTOON() {
    return 'webtoon';
  }

  static convertToString(fileType) {
    const stringMap = {
      [this.EPUB]: 'EPUB',
      [this.BOM]: 'BOM',
      [this.PDF]: 'PDF',
      [this.WEBTOON]: '웹툰',
    };
    return stringMap[fileType];
  }
}
