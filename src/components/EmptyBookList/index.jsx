/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const styles = {
  bookListIsEmpty: {
    position: 'relative',
    color: '#40474d',
    // textAlign: 'center',
    width: '100%',
    height: '100%',
    minHeight: 280,
  },
  in: {
    width: 300,
    height: 100,
    display: 'inline-block',
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -150,
    marginTop: -40,
    fontSize: 15,
    textAlign: 'center',
  },
  icon: {
    width: 30,
    height: 38,
    fill: '#d1d5d9',
    marginBottom: 20,
  },
};

const EmptyBookList = ({ message, IconComponent }) => (
  <div css={styles.bookListIsEmpty}>
    <div css={styles.in}>
      {IconComponent && <IconComponent css={styles.icon} />}
      <br />
      {message}
    </div>
  </div>
);

export default EmptyBookList;
