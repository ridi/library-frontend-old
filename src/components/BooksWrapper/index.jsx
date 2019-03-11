/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, useLayoutEffect } from 'react';
import * as styles from '../../styles/books';

const BooksWrapper = ({ viewType, renderBooks }) => {
  const booksWrapperClassName = 'BooksWrapper';
  const bookClassName = 'Book';
  const [additionalPadding, setAdditionalPadding] = useState(0);

  const setBooksAdditionalPadding = () => {
    const books = document.querySelector(`.${booksWrapperClassName}`);
    const book = document.querySelector(`.${bookClassName}`);

    if (!books || !book) {
      setTimeout(() => setBooksAdditionalPadding(), 100);
      return;
    }

    setAdditionalPadding(Math.floor((books.offsetWidth % book.offsetWidth) / 2));
  };

  useLayoutEffect(() => {
    setBooksAdditionalPadding();
    window.addEventListener('resize', setBooksAdditionalPadding);
    return () => {
      window.removeEventListener('resize', setBooksAdditionalPadding);
    };
  });

  return (
    <div className={booksWrapperClassName} css={styles.booksWrapper(viewType, additionalPadding)}>
      {renderBooks({ className: bookClassName })}
    </div>
  );
};

export default BooksWrapper;
