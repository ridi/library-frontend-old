/** @jsx jsx */
import { jsx } from '@emotion/core';
import { bookListStyle } from '../../styles/bookLayout';

const BookList = ({ children }) => <div css={bookListStyle}>{children}</div>;
export default BookList;
