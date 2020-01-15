import { useEffect, useLayoutEffect, useState } from 'react';

import * as styles from 'commonStyles/books';

const BooksWrapper = ({ viewType, children }) => {
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

  return (
    <div className={booksWrapperClassName} css={styles.booksWrapper(viewType, additionalPadding)}>
      {children}
    </div>
  );
};

export default BooksWrapper;
