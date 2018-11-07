import React from 'react';
import { css } from 'emotion';

const BookListCss = css`
  display: flex;
  flex-wrap: wrap;
  margin-right: -24px;
  margin-bottom: 30px;
`;

const BookList = ({ children }) => <div className={BookListCss}>{children}</div>;

export default BookList;
