import React from 'react';

import NoneDashedArrowLeft from '../../svgs/NoneDashedArrowLeft.svg';
import NoneDashedArrowRight from '../../svgs/NoneDashedArrowRight.svg';
import ThreeDotsHorizontal from '../../svgs/ThreeDotsHorizontal.svg';
import { calcPageBlock, makePageRange } from '../../utils/pagination';
import * as styles from './styles';

function NavigationButton(props) {
  const { children, onPageChange, page, style } = props;
  const handleClick = React.useCallback(() => onPageChange(page), [onPageChange, page]);
  return (
    <button type="button" css={[styles.pageButton, style]} onClick={handleClick}>
      {children}
    </button>
  );
}

export default function Paginator(props) {
  const { currentPage, needGoFirst, needGoLast, onPageChange, pageCount, style, totalPages } = props;
  if (totalPages <= 1 || currentPage < 1 || currentPage > totalPages) {
    return null;
  }

  function renderGoFirst() {
    if (currentPage <= pageCount) {
      return null;
    }

    return (
      <>
        <div css={styles.buttonWrapper}>
          <NavigationButton style={styles.textButton} onPageChange={onPageChange} page={1}>
            처음
          </NavigationButton>
        </div>
        <span css={styles.paginatorDots}>
          <ThreeDotsHorizontal css={styles.dots} />
        </span>
      </>
    );
  }

  function renderGoLast() {
    if (calcPageBlock(currentPage, pageCount) === calcPageBlock(totalPages, pageCount)) {
      return null;
    }

    return (
      <>
        <span css={styles.paginatorDots}>
          <ThreeDotsHorizontal css={styles.dots} />
        </span>
        <div css={styles.buttonWrapper}>
          <NavigationButton style={styles.textButton} onPageChange={onPageChange} page={totalPages}>
            마지막
          </NavigationButton>
        </div>
      </>
    );
  }

  function renderGoPrev() {
    // 첫 페이지와 같은 블록이면 노출하지 않는다.
    if (calcPageBlock(currentPage, pageCount) === calcPageBlock(1, pageCount)) {
      return null;
    }

    // 이전 블록의 첫 페이지 계산
    // 2개의 이전블록의 마지막 페이지 의 다음페이지로 계산한다.
    const firstPrevBlockPage = (calcPageBlock(currentPage, pageCount) - 2) * pageCount + 1;

    return (
      <div css={styles.buttonWrapper}>
        <NavigationButton onPageChange={onPageChange} page={firstPrevBlockPage}>
          <NoneDashedArrowLeft css={styles.pageItemIcon} />
          <span className="a11y">이전 페이지</span>
        </NavigationButton>
      </div>
    );
  }

  function renderGoNext() {
    // 마지막 페이지와 같은 블록이면 노출하지 않는다.
    if (calcPageBlock(currentPage, pageCount) === calcPageBlock(totalPages, pageCount)) {
      return null;
    }

    // 다음 블록의 첫 페이지 계산
    // 현재 블록의 마지막 페이지의 다음 페이지로 계산하다.
    const firstNextBlockPage = calcPageBlock(currentPage, pageCount) * pageCount + 1;

    return (
      <div css={styles.buttonWrapper}>
        <NavigationButton onPageChange={onPageChange} page={firstNextBlockPage}>
          <NoneDashedArrowRight css={styles.pageItemIcon} />
          <span className="a11y">다음 페이지</span>
        </NavigationButton>
      </div>
    );
  }

  function renderPageItems() {
    const pageRange = makePageRange(currentPage, totalPages, pageCount);

    return (
      <ul css={styles.pageItems}>
        {pageRange.map(page => (
          <li key={page} css={styles.pageItem}>
            <NavigationButton style={currentPage === page && styles.pageButtonActive} onPageChange={onPageChange} page={page}>
              {page}
            </NavigationButton>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div css={[styles.paginator, style]}>
      {needGoFirst && renderGoFirst()}
      {renderGoPrev()}
      {renderPageItems()}
      {renderGoNext()}
      {needGoLast && renderGoLast()}
    </div>
  );
}
