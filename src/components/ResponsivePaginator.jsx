/** @jsx jsx */
import { jsx } from '@emotion/core';
import Router from 'next/router';
import React from 'react';
import { MOBILE_PAGE_COUNT, PAGE_COUNT } from '../constants/page';
import { makeLinkProps } from '../utils/uri';
import { MQ, Responsive } from '../styles/responsive';
import Paginator from './Paginator';

const styles = {
  mobile: {
    ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large], {
      display: 'block',
    }),
    ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
      display: 'none',
    }),
  },
  pc: {
    ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large], {
      display: 'none',
    }),
    ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
      display: 'block',
    }),
  },
};

export const ResponsivePaginatorWithHandler = ({ currentPage, totalPages, onPageChange }) => {
  const commonProps = {
    currentPage,
    totalPages,
    onPageChange,
  };
  return (
    <>
      <Paginator style={styles.pc} pageCount={PAGE_COUNT} needGoFirst needGoLast {...commonProps} />
      <Paginator style={styles.mobile} pageCount={MOBILE_PAGE_COUNT} {...commonProps} />
    </>
  );
};

const ResponsivePaginator = ({ currentPage, totalPages, href, as, query, scroll }) => {
  const handlePageChange = React.useCallback(
    page => {
      const newQuery = query || {};
      const linkProps = makeLinkProps(href, as, { ...newQuery, page });
      Router.push(linkProps.href, linkProps.as);

      // next/link의 로직
      const doScrollTop = scroll == null ? !linkProps.as.pathname.includes('#') : scroll;
      if (doScrollTop) {
        window.scrollTo(0, 0);
        document.body.focus();
      }
    },
    [href, as, query, scroll],
  );
  return <ResponsivePaginatorWithHandler currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />;
};

export default ResponsivePaginator;
