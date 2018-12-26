/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { MOBILE_PAGE_COUNT, PAGE_COUNT } from '../constants/page';
import { screenSize } from '../styles';
import Paginator from './Paginator';

const styles = {
  mobile: Object.assign(
    {},
    screenSize.isMobile({
      display: 'block',
    }),
    screenSize.isPc({
      display: 'none',
    }),
  ),
  pc: Object.assign(
    {},
    screenSize.isMobile({
      display: 'none',
    }),
    screenSize.isPc({
      display: 'block',
    }),
  ),
};

const ResponsivePaginator = ({ currentPage, totalPages, href, as, query }) => (
  <React.Fragment>
    <div css={styles.pc}>
      <Paginator currentPage={currentPage} totalPages={totalPages} pageCount={PAGE_COUNT} href={href} as={as} query={query} />
    </div>
    <div css={styles.mobile}>
      <Paginator currentPage={currentPage} totalPages={totalPages} pageCount={MOBILE_PAGE_COUNT} href={href} as={as} query={query} />
    </div>
  </React.Fragment>
);

export default ResponsivePaginator;
