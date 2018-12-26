/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const styles = {
  bookListIsEmpty: css({
    margin: 20,
    paddingTop: 30,
    paddingBottom: 30,
  }),
};

const EmptyBookList = ({ message }) => <div css={styles.bookListIsEmpty}>{message}</div>;

export default EmptyBookList;
