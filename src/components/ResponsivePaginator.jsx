/** @jsx jsx */
import { jsx } from '@emotion/core';
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

const ResponsivePaginator = ({ currentPage, totalPages, href, as, query }) => (
  <>
    <Paginator
      style={styles.pc}
      currentPage={currentPage}
      totalPages={totalPages}
      pageCount={PAGE_COUNT}
      href={href}
      as={as}
      query={query}
      needGoFirst
      needGoLast
    />
    <Paginator
      style={styles.mobile}
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
