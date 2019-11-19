import { useEffect, useLayoutEffect, useState } from 'react';

import * as styles from '../../styles/books';

const BooksWrapper = ({ viewType, books, renderBook, children }) => {
  const isLoaded = true;
  const booksWrapperClassName = 'BooksWrapper';
  const bookClassName = 'Book';
  const [additionalPadding, setAdditionalPadding] = useState(0);

  const setBooksAdditionalPadding = () => {
    const booksNode = document.querySelector(`.${booksWrapperClassName}`);
    const bookNode = document.querySelector(`.${bookClassName}`);
    booksNode && bookNode && setAdditionalPadding(Math.floor((booksNode.offsetWidth % bookNode.offsetWidth) / 2));
  };

  useEffect(() => {
    window.addEventListener('resize', setBooksAdditionalPadding);
    return () => {
      window.removeEventListener('resize', setBooksAdditionalPadding);
    };
  }, [isLoaded]);

  useLayoutEffect(() => {
    setBooksAdditionalPadding();
  }, [isLoaded, viewType]);

  const bookElements = books.map(book => renderBook({ book, className: bookClassName }));
  let body = bookElements;
  if (typeof children === 'function') {
    body = children({ books: bookElements });
  }
  return (
    <div className={booksWrapperClassName} css={styles.booksWrapper(viewType, additionalPadding)}>
      {body}
    </div>
  );
};

export default BooksWrapper;
