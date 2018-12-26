/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { MOBILE_PAGE_COUNT, PAGE_COUNT } from '../constants/page';
import { screenSize } from '../styles';
import Paginator from './Paginator';

const styles = {
  mobile: css([
    screenSize.isMobile({
      display: 'block',
    }),
    { display: 'none' },
  ]),
  pc: css([
    screenSize.isMobile({
      display: 'block',
    }),
    { display: 'none' },
  ]),
};

const ResponsivePaginator = ({ currentPage, totalPages, href, as, query }) => (
  <>
    <Paginator css={styles.pc} currentPage={currentPage} totalPages={totalPages} pageCount={PAGE_COUNT} href={href} as={as} query={query} />
    <Paginator
      css={styles.mobile}
      currentPage={currentPage}
      totalPages={totalPages}
      pageCount={MOBILE_PAGE_COUNT}
      href={href}
      as={as}
      query={query}
    />
  </>
);

export default ResponsivePaginator;
