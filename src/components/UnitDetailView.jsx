/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';

import AuthorRole from '../constants/authorRole';

const styles = {
  detailView: css({}),

  thumbnailWrapper: css({}),
  thumbnail: css({}),
  ridibooksLink: css({}),

  unitTitle: css({}),
  authorList: css({}),
};

class UnitDetailView extends React.Component {
  compileAuthors() {
    const {
      book: { authors },
    } = this.props;
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

  render() {
    // 필요 데이터
    // Unit 데이터 (타이틀)
    // Unit의 대표 bookId
    // 대표 북의 데이터 (썸네일, 작가 등)
    const { unit, book } = this.props;

    return (
      <section css={styles.detailView}>
        <div css={styles.thumbnailWrapper}>
          <img css={styles.thumbnail} src={book.thumbnail.large} alt={`${unit.title} 커버이미지`} />
        </div>
        <div css={styles.ridibooksLink}>리디북스로 가기</div>
        <div css={styles.unitTitle}>{unit.title}</div>
        <div css={styles.authorList}>{this.compileAuthors()}</div>
      </section>
    );
  }
}

export default UnitDetailView;
