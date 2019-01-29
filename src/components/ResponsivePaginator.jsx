/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MOBILE_PAGE_COUNT, PAGE_COUNT } from '../constants/page';
import { Responsive } from '../styles/responsive';
import Paginator from './Paginator';

const styles = {
  mobile: Object.assign(
    {},
    Responsive.Mobile({
      display: 'block',
    }),
    Responsive.Pc({
      display: 'none',
    }),
  ),
  pc: Object.assign(
    { borderTop: '1px solid #d1d5d9' },
    Responsive.Mobile({
      display: 'none',
    }),
    Responsive.Pc({
      display: 'block',
    }),
  ),
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
