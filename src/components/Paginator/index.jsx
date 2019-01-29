/** @jsx jsx */
import React from 'react';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import { jsx } from '@emotion/core';

import * as styles from './styles';
import { calcPageBlock, makePageRange } from '../../utils/pagination';
import { makeLinkProps } from '../../utils/uri';

export default class Paginator extends React.Component {
  getLinkProps(page) {
    const { href, as, query = {} } = this.props;
    return makeLinkProps(href, as, { ...query, page });
  }

  renderGoFirst() {
    const { currentPage, pageCount } = this.props;

    if (currentPage <= pageCount) {
      return null;
    }

    return (
      <>
        <div css={styles.buttonWrapper}>
          <Link {...this.getLinkProps(1)}>
            <a css={[styles.pageButton, styles.textButton]}>처음</a>
          </Link>
        </div>
        <span css={styles.paginatorDots}>
          <Icon name="dotdotdot" css={styles.dots} />
        </span>
      </>
    );
  }

  renderGoLast() {
    const { currentPage, totalPages, pageCount } = this.props;

    if (calcPageBlock(currentPage, pageCount) === calcPageBlock(totalPages, pageCount)) {
      return null;
    }

    return (
      <>
        <span css={styles.paginatorDots}>
          <Icon name="dotdotdot" css={styles.dots} />
        </span>
        <div css={styles.buttonWrapper}>
          <Link {...this.getLinkProps(totalPages)}>
            <a css={[styles.pageButton, styles.textButton]}>마지막</a>
          </Link>
        </div>
      </>
    );
  }

  renderGoPrev() {
    const { currentPage } = this.props;

    if (currentPage === 1) {
      return null;
    }

    return (
      <div css={styles.buttonWrapper}>
        <Link {...this.getLinkProps(currentPage - 1)}>
          <a css={styles.pageButton}>
            <Icon name="arrow_8_left" css={styles.pageItemIcon} />
            <span className="a11y">이전 페이지</span>
          </a>
        </Link>
      </div>
    );
  }

  renderGoNext() {
    const { currentPage, totalPages } = this.props;

    if (currentPage === totalPages) {
      return null;
    }

    return (
      <div css={styles.buttonWrapper}>
        <Link {...this.getLinkProps(currentPage + 1)}>
          <a css={styles.pageButton}>
            <Icon name="arrow_8_right" css={styles.pageItemIcon} />
            <span className="a11y">다음 페이지</span>
          </a>
        </Link>
      </div>
    );
  }

  renderPageItems() {
    const { currentPage, totalPages, pageCount } = this.props;
    const pageRange = makePageRange(currentPage, totalPages, pageCount);

    return (
      <ul css={styles.pageItems}>
        {pageRange.map(page => (
          <li key={page} css={styles.pageItem}>
            <Link {...this.getLinkProps(page)}>
              <a css={[styles.pageButton, currentPage === page && styles.pageButtonActive]}>{page}</a>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { totalPages, style, needGoFirst, needGoLast } = this.props;
    if (totalPages <= 1) {
      return null;
    }

    return (
      <div css={[styles.paginator, style]}>
        {needGoFirst && this.renderGoFirst()}
        {this.renderGoPrev()}
        {this.renderPageItems()}
        {this.renderGoNext()}
        {needGoLast && this.renderGoLast()}
      </div>
    );
  }
}
