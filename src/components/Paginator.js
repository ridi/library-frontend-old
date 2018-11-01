import React from 'react';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';

import { makeRange } from '../../utils/array';

export const PageItem = ({ element, children, props }) => (
  <element {...props}>{children}</element>
);

export default class Paginator extends React.Component {
  calcPageRange() {
    const { currentPage, totalPages, pageCount } = this.props;

    const start = Math.max(1, currentPage - pageCount);
    const end = Math.min(currentPage + pageCount, totalPages);

    return makeRange(start, end);
  }

  makeProps(page) {
    const { pathname } = this.props;
    return { href: { pathname, query: { page } } };
  }

  renderGoFirst() {
    const { currentPage, pageCount } = this.props;

    if (currentPage > pageCount + 1) {
      return null;
    }

    return (
      <>
        <PageItem element={Link} props={this.makeProps(1)}>
          처음
        </PageItem>
        <span className="Pagination_Dots">
          <Icon name="dotdotdot" className="Pagination_DeviderIcon" />
        </span>
      </>
    );
  }

  renderGoPrev() {
    const { currentPage } = this.props;

    if (currentPage === 1) {
      return null;
    }

    return (
      <PageItem element={Link} props={this.makeProps(currentPage - 1)}>
        <Icon name="arrow_8_left" className="Pagination_GoPrevIcon" />
      </PageItem>
    );
  }

  renderGoNext() {
    const { currentPage, totalPages } = this.props;

    if (currentPage === totalPages) {
      return null;
    }

    return (
      <PageItem element={Link} props={this.makeProps(currentPage + 1)}>
        <Icon name="arrow_8_right" className="Pagination_GoPrevIcon" />
      </PageItem>
    );
  }

  renderGoLast() {
    const { currentPage, totalPages } = this.props;

    if (currentPage === totalPages) {
      return null;
    }

    return (
      <>
        <span className="Pagination_Dots">
          <Icon name="dotdotdot" className="Pagination_DeviderIcon" />
        </span>
        <PageItem element={Link} props={this.makeProps(totalPages)}>
          마지막
        </PageItem>
      </>
    );
  }

  renderPageItems() {
    const pageRange = this.calcPageRange();
    return pageRange.map(page => (
      <li>
        <PageItem element={Link} props={this.makeProps(page)}>
          {page}
        </PageItem>
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
