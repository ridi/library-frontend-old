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

  static convertToString(fileType) {
    const stringMap = {
      [this.EPUB]: 'EPUB',
      [this.BOM]: 'BOM',
      [this.PDF]: 'PDF',
    };
    return stringMap[fileType];
  }
}
