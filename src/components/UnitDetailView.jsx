import { Icon } from '@ridi/rsg';

/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import connect from 'react-redux/es/connect/connect';
import config from '../config';

import AuthorRole from '../constants/authorRole';
import { UnitType } from '../constants/unitType';
import { BookFileType } from '../services/book/constants';
import { downloadBooks } from '../services/common/actions';

import { Responsive } from '../styles/responsive';
import { formatFileSize } from '../utils/file';
import { numberWithUnit } from '../utils/number';

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
  bookDescription: css({
    marginTop: 8,
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#40474d',
    clear: 'both',

    ...Responsive.Pc({
      marginTop: 16,
    }),
  }),
  bookDescriptionTitle: css({
    fontWeight: 'bold',
    letterSpacing: -0.28,
    lineHeight: 'normal',
  }),
  bookDescriptionBody: css({
    marginTop: 9,
    lineHeight: 1.5,
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitBoxOrient: 'vertical',
  }),
  bookDescriptionFolded: css({
    // TODO: 변수화 해야 한다.
    maxHeight: 9 * 23,
    WebkitLineClamp: 9,
  }),
  bookDescriptionExpended: css({
    // TODO: 변수화 해야 한다.
    maxHeight: 'unset',
    WebkitLineClamp: 'unset',
  }),
  bookDescriptionExpend: css({
    textAlign: 'right',
    marginTop: 11.5,
  }),
  bookDescriptionExpendButton: css({
    fontSize: 15,
    textAlign: 'right',
    color: '#808991',
    fill: '#9ea7ad',
  }),
  downloadButton: css({
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    borderRadius: 4,
    boxShadow: '1px 1px 1px 0 rgba(31, 140, 230, 0.3)',
    backgroundColor: '#1f8ce6',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.7,

    ...Responsive.Pc({
      width: 250,
    }),
  }),
  drmFreeDownloadButton: css({
    width: '100%',
    marginBottom: 10,
    height: 50,
    borderRadius: 4,
    boxShadow: '1px 1px 1px 0 rgba(209, 213, 217, 0.3)',
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#808991',
    letterSpacing: -0.7,

    ...Responsive.Pc({
      width: 250,
    }),
  }),
  fileInfo: css({
    marginTop: 24,
    marginBottom: 10,
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#808991',
  }),
  fileInfoText: css({
    float: 'left',
  }),
  fileInfoDelimiter: css({
    width: 1,
    height: 9,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#d1d5d9',
    float: 'left',
  }),
};

class UnitDetailView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
    };
  }

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

  renderFileInfo() {
    const { book } = this.props;

    // info의 text 에 | 와 \ 사용되면 안된다. 두개의 문자는 예약어이다.
    const infos = [];

    if (book.file.format !== BookFileType.BOM) {
      infos.push(`${BookFileType.convertToString(book.file.format)}`);
    }

    if (book.file.character_count) {
      infos.push(`약 ${numberWithUnit(book.file.character_count)}자`);
    }

    if (book.file.size) {
      infos.push(`${formatFileSize(book.file.size)}`);
    }

    const delimiter = '|';
    const infosWithDelimiter = infos.join(`\\${delimiter}\\`).split('\\');

    return (
      <div css={styles.fileInfo}>
        {infosWithDelimiter.map(info =>
          info === delimiter ? <div css={styles.fileInfoDelimiter} /> : <div css={styles.fileInfoText}> {info} </div>,
        )}
      </div>
    );
  }

  expand() {
    this.setState({ isExpanded: true });
  }

  renderExpenderButton() {
    const { isExpanded } = this.state;

    if (isExpanded) {
      return null;
    }

    return (
      <div css={styles.bookDescriptionExpend}>
        <button type="button" onClick={() => this.expand()} css={styles.bookDescriptionExpendButton}>
          계속 읽기
          <Icon name="arrow_5_down" />
        </button>
      </div>
    );
  }

  renderDescription() {
    const { isExpanded } = this.state;
    const { bookDescription } = this.props;
    if (!bookDescription) {
      return null;
    }

    return (
      <div css={styles.bookDescription}>
        <div css={styles.bookDescriptionTitle}>책 소개</div>
        <div css={[styles.bookDescriptionBody, isExpanded ? styles.bookDescriptionExpended : styles.bookDescriptionFolded]}>
          <p dangerouslySetInnerHTML={{ __html: bookDescription.intro.split('\n').join('<br />') }} />
        </div>
        {this.renderExpenderButton()}
      </div>
    );
  }

  renderDownloadBottuon() {
    const { book, downloadable, dispatchDownloadBooks } = this.props;

    if (!downloadable) {
      return null;
    }

    return (
      <button
        type="button"
        css={styles.downloadButton}
        onClick={() => {
          dispatchDownloadBooks([book.id]);
        }}
      >
        다운로드
      </button>
    );
  }

  renderDrmFreeDownloadButton() {
    const { book } = this.props;
    if (!book.file.is_drm_free) {
      return null;
    }

    return (
      <button
        type="button"
        css={styles.drmFreeDownloadButton}
        onClick={() => {
          window.location.href = `${config.STORE_API_BASE_URL}/api/user-books/${book.id}/raw-download`;
        }}
      >
        EPUB 파일 다운로드
      </button>
    );
  }

  render() {
    // 필요 데이터
    // Unit 데이터 (타이틀)
    // Unit의 대표 bookId
    // 대표 북의 데이터 (썸네일, 작가 등)
    const { unit, book } = this.props;

    return (
      <>
        <section css={styles.detailView}>
          <div css={[styles.wrapper, styles.thumbnailWrapper]}>
            <img css={styles.thumbnail} src={book.thumbnail.large} alt={`${unit.title} 커버이미지`} />
            <a
              css={styles.ridibooksLink}
              href={`${config.STORE_API_BASE_URL}/v2/Detail?id=${book.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              리디북스에서 보기 &gt;
            </a>
          </div>
          <div css={[styles.wrapper, styles.infoWrapper]}>
            <div css={styles.unitTitle}>{unit.title}</div>
            <div css={styles.authorList}>{this.compileAuthors()}</div>
            {UnitType.isBook(unit.type) ? this.renderFileInfo() : null}
            {UnitType.isBook(unit.type) ? this.renderDownloadBottuon() : null}
            {UnitType.isBook(unit.type) ? this.renderDrmFreeDownloadButton() : null}
          </div>
        </section>

        {UnitType.isBook(unit.type) ? this.renderDescription() : null}
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  dispatchDownloadBooks: downloadBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitDetailView);
