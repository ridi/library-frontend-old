/** @jsx jsx */
import React from 'react';
import Link from 'next/link';
import { jsx } from '@emotion/core';

import * as styles from './styles';
import NoneDashedArrowLeft from '../../svgs/NoneDashedArrowLeft.svg';
import NoneDashedArrowRight from '../../svgs/NoneDashedArrowRight.svg';
import ThreeDotsHorizontal from '../../svgs/ThreeDotsHorizontal.svg';
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
          <Link prefetch {...this.getLinkProps(1)}>
            <a css={[styles.pageButton, styles.textButton]}>처음</a>
          </Link>
        </div>
        <span css={styles.paginatorDots}>
          <ThreeDotsHorizontal css={styles.dots} />
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
          <ThreeDotsHorizontal css={styles.dots} />
        </span>
        <div css={styles.buttonWrapper}>
          <Link prefetch {...this.getLinkProps(totalPages)}>
            <a css={[styles.pageButton, styles.textButton]}>마지막</a>
          </Link>
        </div>
      </>
    );
  }

  renderGoPrev() {
    const { currentPage, pageCount } = this.props;

    // 첫 페이지와 같은 블록이면 노출하지 않는다.
    if (calcPageBlock(currentPage, pageCount) === calcPageBlock(1, pageCount)) {
      return null;
    }

    // 이전 블록의 첫 페이지 계산
    // 2개의 이전블록의 마지막 페이지 의 다음페이지로 계산한다.
    const firstPrevBlockPage = (calcPageBlock(currentPage, pageCount) - 2) * pageCount + 1;

    return (
      <div css={styles.buttonWrapper}>
        <Link prefetch {...this.getLinkProps(firstPrevBlockPage)}>
          <a css={styles.pageButton}>
            <NoneDashedArrowLeft css={styles.pageItemIcon} />
            <span className="a11y">이전 페이지</span>
          </a>
        </Link>
      </div>
    );
  }

  renderGoNext() {
    const { currentPage, totalPages, pageCount } = this.props;

    // 마지막 페이지와 같은 블록이면 노출하지 않는다.
    if (calcPageBlock(currentPage, pageCount) === calcPageBlock(totalPages, pageCount)) {
      return null;
    }

    // 다음 블록의 첫 페이지 계산
    // 현재 블록의 마지막 페이지의 다음 페이지로 계산하다.
    const firstNextBlockPage = calcPageBlock(currentPage, pageCount) * pageCount + 1;

    return (
      <div css={styles.buttonWrapper}>
        <Link prefetch {...this.getLinkProps(firstNextBlockPage)}>
          <a css={styles.pageButton}>
            <NoneDashedArrowRight css={styles.pageItemIcon} />
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
            <Link prefetch {...this.getLinkProps(page)}>
              <a css={[styles.pageButton, currentPage === page && styles.pageButtonActive]}>{page}</a>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { currentPage, totalPages, style, needGoFirst, needGoLast } = this.props;
    if (totalPages <= 1 || currentPage < 1 || currentPage > totalPages) {
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
