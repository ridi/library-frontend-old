/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';

import AuthorRole from '../constants/authorRole';
import { Responsive } from '../styles/responsive';

const styles = {
  detailView: css({
    display: 'flex',
    flexDirection: 'column',

    marginTop: 28,

    ...Responsive.Pc({
      marginTop: 50,
      flexDirection: 'row',
    }),

    ...Responsive.W1280({
      marginLeft: 100,
    }),
  }),

  wrapper: css({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  thumbnailWrapper: css({}),
  thumbnail: css({
    backgroundImage: 'linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.0) 6%, rgba(0, 0, 0, 0.0) 94%, rgba(0, 0, 0, 0.2))',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    width: 130,

    ...Responsive.Pc({
      width: 180,
    }),
  }),
  ridibooksLink: css({
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#1f8ce6',
    marginTop: 16,
  }),

  infoWrapper: css({
    marginTop: 24,

    alignItems: 'start',
    justifyContent: 'left',

    ...Responsive.Pc({
      marginTop: 48,
      marginLeft: 40,
    }),
  }),
  unitTitle: css({
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 1.54,
    letterSpacing: -0.4,
    color: '#212529',

    ...Responsive.Pc({
      fontSize: 30,
      fontWeight: 'bold',
      lineHeight: 1.03,
      letterSpacing: -0.6,
      color: '#212529',
    }),
  }),
  authorList: css({
    marginTop: 8,
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#40474d',

    ...Responsive.Pc({
      marginTop: 16,
    }),
  }),
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
        <div css={[styles.wrapper, styles.thumbnailWrapper]}>
          <img css={styles.thumbnail} src={book.thumbnail.large} alt={`${unit.title} 커버이미지`} />
          <div css={styles.ridibooksLink}>리디북스로 가기</div>
        </div>
        <div css={[styles.wrapper, styles.infoWrapper]}>
          <div css={styles.unitTitle}>{unit.title}</div>
          <div css={styles.authorList}>{this.compileAuthors()}</div>
        </div>
      </section>
    );
  }
}

export default UnitDetailView;
