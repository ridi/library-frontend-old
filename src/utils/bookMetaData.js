import { ROLE_DESCRIPTIONS } from 'constants/authorRole';

import { BookFileType } from '../services/book/constants';
import { formatFileSize } from './file';
import { numberWithUnit } from './number';

function excerpt(names, limit) {
  const baseNames = names.slice(0, limit).join(', ');
  return names.length > limit ? `${baseNames} 외 ${names.length - limit}명` : baseNames;
}

export default class BookMetaData {
  constructor(platformBookData, unitData) {
    this.bookData = platformBookData;
    this.unitData = unitData;
  }

  get authors() {
    const LIMIT = 2;
    const { authorsOrdered } = this.bookData;
    if (!authorsOrdered) return null;

    // 같은 역할끼리 묶기
    const authorsGrouped = [];
    authorsOrdered.forEach(author => {
      const ongoingGroup = authorsGrouped[authorsGrouped.length - 1];
      if (ongoingGroup == null || ongoingGroup.role !== author.role) {
        authorsGrouped.push({
          authors: [
            {
              name: author.name,
              id: author.id,
            },
          ],
          role: author.role,
        });
      } else {
        ongoingGroup.authors.push({
          name: author.name,
          id: author.id,
        });
      }
    });

    return authorsGrouped.map(group => {
      const names = excerpt(
        group.authors.map(author => author.name),
        LIMIT,
      );
      return `${names} ${ROLE_DESCRIPTIONS[group.role]}`;
    });
  }

  get authorsSimple() {
    const LIMIT = 2;
    const { authorsOrdered } = this.bookData;
    if (!authorsOrdered) return null;
    return excerpt(
      authorsOrdered.map(author => author.name),
      LIMIT,
    );
  }

  get genre() {
    // 카테고리는 무조건 1개 이상 있다.
    return this.bookData.categories[0].genre;
  }

  get infos() {
    const { file, series } = this.bookData;

    // info의 text 에 | 와 \ 사용되면 안된다. 두개의 문자는 예약어이다.
    const infos = [];

    if (file && !(file.format === BookFileType.BOM || file.format === BookFileType.WEBTOON)) {
      infos.push(`${BookFileType.convertToString(file.format)}`);
    }

    if (this.unitData.character_count && file.format !== BookFileType.WEBTOON) {
      const characterCount = numberWithUnit(this.unitData.character_count);
      // null 일 수 있다.
      if (characterCount) {
        infos.push(`약 ${characterCount}자`);
      }
    }

    if (this.unitData.page_count && file.format !== BookFileType.WEBTOON) {
      infos.push(`${this.unitData.page_count}쪽`);
    }

    if (this.unitData.file_size) {
      infos.push(`${formatFileSize(this.unitData.file_size)}`);
    }

    if (this.unitData.total_count > 1) {
      const unitOfCount = series ? series.property.unit : '권';
      infos.push(`총 ${this.unitData.total_count}${unitOfCount}`);
    }

    return infos;
  }
}
