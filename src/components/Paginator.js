import React from 'react';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import { css } from 'emotion';
import classNames from 'classnames';

import { calcPageBlock, makePageRange } from '../utils/pagination';
import { snakelize } from '../utils/snakelize';

const paginatorCss = css`
  height: 30px;
  margin: 0;
  padding: 20px 0 0;
  line-height: 30px;
  text-align: center;
  white-space: nowrap;
`;

const horizontalWrapperCss = css`
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
`;

const pageItemCss = css`
  display: inline-block;
  min-width: 42px;
  height: 32px;
  margin-left: -1px;
  padding: 0 10px;
  line-height: 30px;
}`;

const pageItemIconCss = css`
  width: 6px;
  height: 9px;
  fill: #818a92;
`;

const pageItemGroupCss = css`
  display: inline-block;
  margin: 0 6px;

  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const pageItemGroupMemberCss = css`
  float: left;
`;

const paginatorDotsCss = css`
  display: inline-block;
  width: 8px;
  height: var(--Paging-height);
  padding: 0 3px;
`;

const paginatorDeviderDotsCss = css`
  width: 100%;
  vertical-align: middle;
  fill: #bfc4c8;
`;

export default class Paginator extends React.Component {
  makeHref(page) {
    const { pathname, query } = this.props;
    const _query = snakelize(query);
    return { pathname, query: { ..._query, page } };
  }

  makeAs(page) {
    const { asPathname, query } = this.props;
    const _query = snakelize(query);
    return { pathname: asPathname, query: { ..._query, page } };
  }

  renderGoFirst() {
    const { currentPage, pageCount } = this.props;

    if (currentPage <= pageCount) {
      return null;
    }

    return (
      <>
        <div className={pageItemCss}>
          <Link href={this.makeHref(1)} as={this.makeAs(1)}>
            <div>처음</div>
          </Link>
        </div>
        <span className={paginatorDotsCss}>
          <Icon name="dotdotdot" className={paginatorDeviderDotsCss} />
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
        <span className={paginatorDotsCss}>
          <Icon name="dotdotdot" className={paginatorDeviderDotsCss} />
        </span>
        <div className={pageItemCss}>
          <Link href={this.makeHref(totalPages)} as={this.makeAs(totalPages)}>
            <div>마지막</div>
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
      <div className={pageItemCss}>
        <Link href={this.makeHref(currentPage - 1)} as={this.makeAs(currentPage - 1)}>
          <div>
            <Icon name="arrow_8_left" className={pageItemIconCss} />
          </div>
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
      <div className={pageItemCss}>
        <Link href={this.makeHref(currentPage + 1)} as={this.makeAs(currentPage + 1)}>
          <div>
            <Icon name="arrow_8_right" className={pageItemIconCss} />
          </div>
        </Link>
      </div>
    );
  }

  renderPageItems() {
    const { currentPage, totalPages, pageCount } = this.props;
    const pageRange = makePageRange(currentPage, totalPages, pageCount);
    return pageRange.map(page => (
      <li key={page} className={classNames(pageItemCss, pageItemGroupMemberCss)}>
        <Link href={this.makeHref(page)} as={this.makeAs(page)}>
          <div>{page}</div>
        </Link>
      </li>
    ));
  }

  render() {
    const { totalPages } = this.props;
    if (totalPages === 0 || totalPages === 1) {
      return null;
    }

    return (
      <div className={paginatorCss}>
        <div className={horizontalWrapperCss}>
          {this.renderGoFirst()}
          {this.renderGoPrev()}
          <ul className={pageItemGroupCss}>{this.renderPageItems()}</ul>
          {this.renderGoNext()}
          {this.renderGoLast()}
        </div>
      </div>
    );
  }
}
