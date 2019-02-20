export default class AuthorRole {
  static get AUTHOR() {
    return 'author';
  }

  static get TRANSLATOR() {
    return 'translator';
  }

  static get PHOTO() {
    return 'author_photo';
  }

  static get BIBLIO_INTRO() {
    return 'bibliographical_introduction';
  }

  static get COMMENTATOR() {
    return 'commentator';
  }

  static get EDITOR() {
    return 'editor';
  }

  static get ILLUSTRATOR() {
    return 'illustrator';
  }

  static get ORIG_AUTHOR() {
    return 'original_author';
  }

  static get PLANNER() {
    return 'planner';
  }

  static get STORY_WRITER() {
    return 'story_writer';
  }

  static get SUPERVISOR() {
    return 'supervise';
  }

  static get PERFORMER() {
    // 연주자(악보PDF용)
    return 'performer';
  }

  static get COMPILER() {
    return 'compiler';
  }

  static get ORIG_ILLUSTRATOR() {
    return 'original_illustrator';
  }

  static convertToString(role) {
    const rolesMap = {
      [this.AUTHOR]: '저',
      [this.STORY_WRITER]: '글',
      [this.ILLUSTRATOR]: '그림',
      [this.TRANSLATOR]: '역',
      [this.PHOTO]: '사진',
      [this.BIBLIO_INTRO]: '해제',
      [this.COMMENTATOR]: '해설',
      [this.EDITOR]: '편집',
      [this.ORIG_AUTHOR]: '원작',
      [this.ORIG_ILLUSTRATOR]: '원화',
      [this.PLANNER]: '기획',
      [this.SUPERVISOR]: '감수',
      [this.PERFORMER]: '연주자',
      [this.COMPILER]: '엮음',
    };
    return rolesMap[role];
  }

  static getPriorities(authors) {
    if (authors[this.AUTHOR]) {
      return [this.AUTHOR, this.ILLUSTRATOR, this.TRANSLATOR];
    }

    if (authors[this.ORIG_AUTHOR]) {
      // 만화 사조영웅전의 경우 [그림 이지청, 김용 원작]으로 사실상 그림이 메인이므로 아래와 같은 우선순위 사용
      return [this.ILLUSTRATOR, this.ORIG_AUTHOR];
    }

    return [
      this.STORY_WRITER,
      this.ILLUSTRATOR,
      this.EDITOR,
      this.PHOTO,
      this.PLANNER,
      // this.TRANSLATOR, TODO: 확인필요 - 저자가 없고 번역만 있으면 이상함
      this.COMMENTATOR,
      this.BIBLIO_INTRO,
      this.COMMENTATOR,
    ];
  }
}
