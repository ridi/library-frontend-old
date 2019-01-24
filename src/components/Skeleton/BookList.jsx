/** @jsx jsx */
import { jsx } from '@emotion/core';
import { bookListStyle, portraitBookListStyle, landscapeBookListStyle } from '../../styles/bookLayout';
import ViewType from '../../constants/viewType';

const BookList = ({ viewType = ViewType.PORTRAIT, children }) => (
  <div css={[bookListStyle, viewType === ViewType.PORTRAIT ? portraitBookListStyle : landscapeBookListStyle]}>{children}</div>
);
export default BookList;
