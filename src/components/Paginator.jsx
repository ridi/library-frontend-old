/** @jsx jsx */
import React from 'react';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import { css, jsx } from '@emotion/core';

import { calcPageBlock, makePageRange } from '../utils/pagination';
import { makeLinkProps } from '../utils/uri';

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
        <div css={pageItemCss}>
          <Link {...this.getLinkProps(1)}>
            <a>처음</a>
          </Link>
        </div>
        <span css={paginatorDotsCss}>
          <Icon name="dotdotdot" css={paginatorDeviderDotsCss} />
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
        <span css={paginatorDotsCss}>
          <Icon name="dotdotdot" css={paginatorDeviderDotsCss} />
        </span>
        <div css={pageItemCss}>
          <Link {...this.getLinkProps(totalPages)}>
            <a>마지막</a>
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
      <div css={pageItemCss}>
        <Link {...this.getLinkProps(currentPage - 1)}>
          <a>
            <Icon name="arrow_8_left" css={pageItemIconCss} />
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
      <div css={pageItemCss}>
        <Link {...this.getLinkProps(currentPage + 1)}>
          <a>
            <Icon name="arrow_8_right" css={pageItemIconCss} />
            <span className="a11y">다음 페이지</span>
          </a>
        </Link>
      </div>
    );
  }

  renderPageItems() {
    const { currentPage, totalPages, pageCount } = this.props;
    const pageRange = makePageRange(currentPage, totalPages, pageCount);
    return pageRange.map(page => (
      <li key={page} css={[pageItemCss, pageItemGroupMemberCss]}>
        <Link {...this.getLinkProps(page)}>
          <a>{page}</a>
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
      <div css={paginatorCss}>
        <div css={horizontalWrapperCss}>
          {this.renderGoFirst()}
          {this.renderGoPrev()}
          <ul css={pageItemGroupCss}>{this.renderPageItems()}</ul>
          {this.renderGoNext()}
          {this.renderGoLast()}
        </div>
      </div>
    );
  }
}
