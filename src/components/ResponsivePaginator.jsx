/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withRouter } from 'react-router-dom';
import React from 'react';
import { MOBILE_PAGE_COUNT, PAGE_COUNT } from '../constants/page';
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

const ResponsivePaginator = ({ currentPage, totalPages, history, location }) => {
  const handlePageChange = React.useCallback(
    page => {
      const params = new URLSearchParams(location.search);
      params.set('page', page);
      const search = params.toString();
      history.push({
        ...location,
        search: search === '' ? '' : `?${search}`,
      });
    },
    [history, location],
  );
  return <ResponsivePaginatorWithHandler currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />;
};

export default withRouter(ResponsivePaginator);
