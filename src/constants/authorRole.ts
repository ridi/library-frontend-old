enum AuthorRole {
  AUTHOR = 'author',
  COMIC_AUTHOR = 'comic_author',
  TRANSLATOR = 'translator',
  PHOTO = 'author_photo',
  BIBLIO_INTRO = 'bibliographical_introduction',
  COMMENTATOR = 'commentator',
  EDITOR = 'editor',
  ILLUSTRATOR = 'illustrator',
  ORIG_AUTHOR = 'original_author',
  PLANNER = 'planner',
  STORY_WRITER = 'story_writer',
  SUPERVISOR = 'supervise',
  PERFORMER = 'performer',
  COMPILER = 'compiler',
  ORIG_ILLUSTRATOR = 'original_illustrator',
}

export const ROLE_DESCRIPTIONS = {
  [AuthorRole.COMIC_AUTHOR]: '글, 그림',
  [AuthorRole.AUTHOR]: '저',
  [AuthorRole.STORY_WRITER]: '글',
  [AuthorRole.ILLUSTRATOR]: '그림',
  [AuthorRole.TRANSLATOR]: '역',
  [AuthorRole.PHOTO]: '사진',
  [AuthorRole.BIBLIO_INTRO]: '해제',
  [AuthorRole.COMMENTATOR]: '해설',
  [AuthorRole.EDITOR]: '편집',
  [AuthorRole.ORIG_AUTHOR]: '원작',
  [AuthorRole.ORIG_ILLUSTRATOR]: '원화',
  [AuthorRole.PLANNER]: '기획',
  [AuthorRole.SUPERVISOR]: '감수',
  [AuthorRole.PERFORMER]: '연주자',
  [AuthorRole.COMPILER]: '엮음',
};

export default AuthorRole;
