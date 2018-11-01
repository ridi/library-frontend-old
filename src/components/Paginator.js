import React from 'react';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';

import { calcPageBlock, makePageRange } from '../utils/pagination';

export default class Paginator extends React.Component {
  makeHref(page) {
    const { pathname } = this.props;
    return { pathname, query: { page } };
  }

  renderGoFirst() {
    const { currentPage, pageCount } = this.props;

    if (currentPage <= pageCount) {
      return null;
    }

    return (
      <>
        <Link href={this.makeHref(1)}>
          <a>처음</a>
        </Link>
        <span className="Pagination_Dots">
          <Icon name="dotdotdot" className="Pagination_DeviderIcon" />
        </span>
      </>
    );
  }

  renderGoLast() {
    const { currentPage, totalPages, pageCount } = this.props;

    if (
      calcPageBlock(currentPage, pageCount) ===
      calcPageBlock(totalPages, pageCount)
    ) {
      return null;
    }

    return (
      <>
        <span className="Pagination_Dots">
          <Icon name="dotdotdot" className="Pagination_DeviderIcon" />
        </span>
        <Link href={this.makeHref(totalPages)}>
          <a>마지막</a>
        </Link>
      </>
    );
  }

  renderGoPrev() {
    const { currentPage } = this.props;

    if (currentPage === 1) {
      return null;
    }

    return (
      <Link href={this.makeHref(currentPage - 1)}>
        <a>
          <Icon name="arrow_8_left" className="Pagination_GoPrevIcon" />
        </a>
      </Link>
    );
  }

  renderGoNext() {
    const { currentPage, totalPages } = this.props;

    if (currentPage === totalPages) {
      return null;
    }

    return (
      <Link href={this.makeHref(currentPage + 1)}>
        <a>
          <Icon name="arrow_8_right" className="Pagination_GoPrevIcon" />
        </a>
      </Link>
    );
  }

  renderPageItems() {
    const { currentPage, totalPages, pageCount } = this.props;
    const pageRange = makePageRange(currentPage, totalPages, pageCount);
    return pageRange.map(page => (
      <li>
        <Link href={this.makeHref(page)}>
          <a>{page}</a>
        </Link>
      </li>
    ));
  }

  render() {
    const { totalPages } = this.props;
    if (totalPages === 1) {
      return null;
    }

    return (
      <ul>
        {this.renderGoFirst()}
        {this.renderGoPrev()}
        {this.renderPageItems()}
        {this.renderGoNext()}
        {this.renderGoLast()}
      </ul>
    );
  }
}
