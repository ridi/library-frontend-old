/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Icon } from '@ridi/rsg';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import config from '../../config';
import { UnitType } from '../../constants/unitType';
import { downloadBooks } from '../../services/common/actions';
import * as styles from './styles';
import BookMetaData from '../../utils/bookMetaData';

class UnitDetailView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
    };
  }

  renderFileInfo = infosWithDelimiter => {
    const delimiter = '|';
    return (
      <div css={styles.fileInfo}>
        {infosWithDelimiter.map(info =>
          info === delimiter ? <div css={styles.fileInfoDelimiter} /> : <div css={styles.fileInfoText}> {info} </div>,
        )}
      </div>
    );
  };

  expand() {
    this.setState({ isExpanded: true });
  }

  renderExpanderButton() {
    const { isExpanded } = this.state;

    if (isExpanded) {
      return null;
    }

    return (
      <div css={styles.bookDescriptionExpend}>
        <button type="button" onClick={() => this.expand()} css={styles.bookDescriptionExpendButton}>
          계속 읽기
          <Icon css={styles.bookDescriptionExpendIcon} name="arrow_5_down" />
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
        {this.renderExpanderButton()}
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

  renderLink() {
    const { book, primaryItem } = this.props;

    if (primaryItem.is_ridiselect) {
      return (
        <a css={styles.ridibooksLink} href={`${config.SELECT_BASE_URL}/book/${book.id}`} target="_blank" rel="noopener noreferrer">
          리디셀렉트에서 보기 &gt;
        </a>
      );
    }

    return (
      <a css={styles.ridibooksLink} href={`${config.STORE_API_BASE_URL}/v2/Detail?id=${book.id}`} target="_blank" rel="noopener noreferrer">
        리디북스에서 보기 &gt;
      </a>
    );
  }

  render() {
    // 필요 데이터
    // Unit 데이터 (타이틀)
    // Unit의 대표 bookId
    // 대표 북의 데이터 (썸네일, 작가 등)
    const { unit, book } = this.props;
    const bookMetadata = new BookMetaData(book);
    return (
      <>
        <section css={styles.detailView}>
          <div css={[styles.wrapper, styles.thumbnailWrapper]}>
            <img css={styles.thumbnail} src={book.thumbnail.large} alt={`${unit.title} 커버이미지`} />
            {this.renderLink()}
          </div>
          <div css={[styles.wrapper, styles.infoWrapper]}>
            <div css={styles.unitTitle}>{unit.title}</div>
            <div css={styles.authorList}>{bookMetadata.author}</div>
            {UnitType.isBook(unit.type) ? this.renderFileInfo(bookMetadata.fileInfosWithDelimiter) : null}
            {UnitType.isBook(unit.type) ? this.renderDownloadBottuon() : null}
            {UnitType.isBook(unit.type) ? this.renderDrmFreeDownloadButton() : null}
          </div>
        </section>

        {UnitType.isBook(unit.type) ? this.renderDescription() : null}
      </>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  dispatchDownloadBooks: downloadBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitDetailView);
