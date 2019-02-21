import AuthorRole from '../constants/authorRole';
import Genre from '../constants/category';
import { BookFileType } from '../services/book/constants';
import { numberWithUnit } from './number';
import { formatFileSize } from './file';

export default class BookMetaData {
  constructor(platformBookData) {
    this.bookData = platformBookData;
  }

  get authors() {
    const LIMIT = 2;
    const { authors } = this.bookData;
    if (!authors) return null;

    const roles = AuthorRole.getPriorities(authors);
    return roles.reduce((previous, role) => {
      const author = authors[role];

      if (author) {
        const names =
          author.length > LIMIT
            ? `${author[0].name}, ${author[1].name} 외 ${author.length - LIMIT}명`
            : author.map(value => value.name).join(', ');

        // 만화 장르의 저자는 글, 그림으로 노출하기 위해 role 을 변경한다.
        const roleForString = this.genre === Genre.COMIC && role === AuthorRole.AUTHOR ? AuthorRole.COMIC_AUTHOR : role;
        previous.push(`${names} ${AuthorRole.convertToString(roleForString)}`);
      }
      return previous;
    }, []);
  }

  get genre() {
    // 카테고리는 무조건 1개 이상 있다.
    return this.bookData.categories[0].genre;
  }

  get authorSimple() {
    const { authors } = this.bookData;
    if (!authors) return null;

    const LIMIT = 2;
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

  get infos() {
    const { file } = this.bookData;
    if (!file) return null;

    // info의 text 에 | 와 \ 사용되면 안된다. 두개의 문자는 예약어이다.
    const infos = [];

    if (!(file.format === BookFileType.BOM || file.format === BookFileType.WEBTOON)) {
      infos.push(`${BookFileType.convertToString(file.format)}`);
    }

    if (file.character_count) {
      const characterCount = numberWithUnit(file.character_count);
      // null 일 수 있다.
      if (characterCount) {
        infos.push(`약 ${numberWithUnit(file.character_count)}자`);
      }
    }

    if (file.page_count) {
      infos.push(`${file.page_count}쪽`);
    }

    if (file.size) {
      infos.push(`${formatFileSize(file.size)}`);
    }

    if (file.is_drm_free) {
      infos.push('DRM Free');
    }

    return infos;
  }
}
