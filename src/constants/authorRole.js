export default class AuthorRole {
  static get AUTHOR() {
    return 'author';
  }

  static get BIBLIO_INTRO() {
    return 'bibliographical_introduction';
  }

  // 만화장르에서는 글, 그림으로 노출하기 위해 임의로 COMIC_AUTHOR 를 만듬
  static get COMIC_AUTHOR() {
    return 'comic_author';
  }

  static get COMMENTATOR() {
    return 'commentator';
  }

  static get COMPILER() {
    return 'compiler';
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

  static get ORIG_ILLUSTRATOR() {
    return 'original_illustrator';
  }

  // 연주자(악보PDF용)
  static get PERFORMER() {
    return 'performer';
  }

  static get PHOTO() {
    return 'author_photo';
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

  static get TRANSLATOR() {
    return 'translator';
  }

  static convertToString(role) {
    const rolesMap = {
      [this.AUTHOR]: '저',
      [this.BIBLIO_INTRO]: '해제',
      [this.COMIC_AUTHOR]: '글, 그림',
      [this.COMMENTATOR]: '해설',
      [this.COMPILER]: '엮음',
      [this.EDITOR]: '편집',
      [this.ILLUSTRATOR]: '그림',
      [this.ORIG_AUTHOR]: '원작',
      [this.ORIG_ILLUSTRATOR]: '원화',
      [this.PERFORMER]: '연주자',
      [this.PHOTO]: '사진',
      [this.PLANNER]: '기획',
      [this.STORY_WRITER]: '글',
      [this.SUPERVISOR]: '감수',
      [this.TRANSLATOR]: '역',
    };
    return rolesMap[role];
  }

  static getPriorities(authors) {
    if (authors[this.AUTHOR]) {
      return [this.AUTHOR, this.STORY_WRITER, this.TRANSLATOR, this.ORIG_AUTHOR, this.ILLUSTRATOR];
    }

    if (authors[this.ORIG_AUTHOR]) {
      // 만화 사조영웅전의 경우 [그림 이지청, 김용 원작]으로 사실상 그림이 메인이므로 아래와 같은 우선순위 사용
      return [this.ILLUSTRATOR, this.ORIG_AUTHOR];
    }

    return [
      this.STORY_WRITER,
      this.TRANSLATOR,
      this.ILLUSTRATOR,
      this.PHOTO,
      this.PLANNER,
      this.BIBLIO_INTRO,
      this.COMPILER,
      this.COMMENTATOR,
      this.EDITOR,
      this.SUPERVISOR,
      this.PERFORMER,
      this.ORIG_ILLUSTRATOR,
    ];
  }
}
