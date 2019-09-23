import React from 'react';
import ViewType from '../../../constants/viewType';
import * as styles from '../../../styles/books';
import BooksWrapper from '../../BooksWrapper';
import LandscapeBook from './LandscapeBook';
import PortraitBook from './PortraitBook';

const SkeletonBookCount = 48;

const SkeletonBooks = ({ viewType }) => (
  <BooksWrapper
    viewType={viewType}
    books={[...Array(SkeletonBookCount).keys()]}
    renderBook={({ book: index, className }) =>
      viewType === ViewType.PORTRAIT ? (
        <div key={index} className={className} css={styles.portrait}>
          <PortraitBook />
        </div>
      ) : (
        <div key={index} className={className} css={styles.landscape}>
          <LandscapeBook />
        </div>
      )
    }
  />
);

export default React.memo(SkeletonBooks);
