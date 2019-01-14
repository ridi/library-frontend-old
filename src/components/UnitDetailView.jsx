/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import AuthorList from './AuthorList';

const styles = {
  detailView: css({}),

  thumbnailWrapper: css({}),
  thumbnail: css({}),
  ridibooksLink: css({}),

  unitTitle: css({}),
};

// 필요 데이터
// Unit 데이터 (타이틀)
// Unit의 대표 bookId
// 대표 북의 데이터 (썸네일, 작가 등)
const UnitDetailView = ({ unit, book }) => (
  <section css={styles.detailView}>
    <div css={styles.thumbnailWrapper}>
      <img css={styles.thumbnail} src={book.thumbnails.large} alt={`${unit.title} 커버이미지`} />
    </div>
    <div css={styles.ridibooksLink}>리디북스로 가기</div>
    <div css={styles.unitTitle}>{unit.title}</div>
    <AuthorList authors={book.authors} />
  </section>
);

export default UnitDetailView;
