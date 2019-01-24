/** @jsx jsx */
import { jsx } from '@emotion/core';
import { portraitBookListStyle, landscapeBookListStyle } from '../../styles/bookLayout';
import ViewType from '../../constants/viewType';

const BookList = ({ viewType = ViewType.PORTRAIT, children }) => (
  <div css={viewType === ViewType.PORTRAIT ? portraitBookListStyle : landscapeBookListStyle}>{children}</div>
);
export default BookList;
