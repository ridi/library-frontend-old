import AuthorRole from '../constants/authorRole';
import { BookFileType } from '../services/book/constants';
import { numberWithUnit } from './number';
import { formatFileSize } from './file';

export default class BookMetaData {
  constructor(platformBookData) {
    this.bookData = platformBookData;
  }

  get author() {
    const { authors } = this.bookData;
    if (!authors) return null;

    const roles = AuthorRole.getPriorities(authors);
    return roles
      .reduce((previous, role) => {
        const author = authors[role];

        if (author) {
          const names = author.map(value => value.name).join(',');
          previous.push(`${names} ${AuthorRole.convertToString(role)}`);
        }
        return previous;
      }, [])
      .join(' | ');
  }

  get authorSimple() {
    const { authors } = this.bookData;
    if (!authors) return null;

    const LIMIT = 3;
    const names = [];
    const roles = AuthorRole.getPriorities(authors);
    roles.forEach(role => {
      const author = authors[role];
      if (author) {
        author.map(value => names.push(value.name));
      }
    });
    const extraCount = names.length > LIMIT ? ` 외 ${names.length - LIMIT}명` : '';
    return `${names.slice(0, LIMIT).join(', ')}${extraCount}`;
  }

  get fileInfosWithDelimiter() {
    const { file } = this.bookData;
    if (!file) return null;

    // info의 text 에 | 와 \ 사용되면 안된다. 두개의 문자는 예약어이다.
    const infos = [];

    if (file.format !== BookFileType.BOM) {
      infos.push(`${BookFileType.convertToString(file.format)}`);
    }

    if (file.character_count) {
      infos.push(`약 ${numberWithUnit(file.character_count)}자`);
    }

    if (file.size) {
      infos.push(`${formatFileSize(file.size)}`);
    }

    const delimiter = '|';

    return infos.join(`\\${delimiter}\\`).split('\\');
  }
}
