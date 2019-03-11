/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useEffect, useState, useLayoutEffect } from 'react';
import * as styles from '../../styles/books';

const BooksWrapper = ({ viewType, renderBooks }) => {
  const isLoaded = true;
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

  useLayoutEffect(
    () => {
      setBooksAdditionalPadding();
      window.addEventListener('resize', setBooksAdditionalPadding);
      return () => {
        window.removeEventListener('resize', setBooksAdditionalPadding);
      };
    },
    [isLoaded],
  );

  useEffect(
    () => {
      setBooksAdditionalPadding();
    },
    [viewType],
  );

  return (
    <div className={booksWrapperClassName} css={styles.booksWrapper(viewType, additionalPadding)}>
      {renderBooks({ className: bookClassName })}
    </div>
  );
};

export default BooksWrapper;
