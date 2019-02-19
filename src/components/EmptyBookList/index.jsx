/** @jsx jsx */
import { jsx } from '@emotion/core';

const styles = {
  bookListIsEmpty: {
    position: 'relative',
    color: '#40474d',
    width: '100%',
    height: '100%',
    minHeight: 400,
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
    fill: '#d1d5d9',
    marginBottom: 20,
  },
};

const EmptyBookList = ({ message, IconComponent, iconWidth = 30, iconHeight = 38 }) => {
  const iconSize = { width: iconWidth, height: iconHeight };
  return (
    <div css={styles.bookListIsEmpty}>
      <div css={styles.in}>
        {IconComponent && <IconComponent css={[styles.icon, iconSize]} />}
        <br />
        {message}
      </div>
    </div>
  );
};

export default EmptyBookList;
