/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const BookListCss = css`
  display: flex;
  flex-wrap: wrap;
  margin-right: -24px;
  margin-bottom: 30px;
`;

const BookList = ({ children }) => <div css={BookListCss}>{children}</div>;

export default BookList;
