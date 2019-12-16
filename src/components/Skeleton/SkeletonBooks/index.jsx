import React from 'react';

import ViewType from '../../../constants/viewType';
import * as styles from '../../../styles/books';
import BooksWrapper from '../../BooksWrapper';
import LandscapeBook from './LandscapeBook';
import PortraitBook from './PortraitBook';

const SkeletonBookCount = 48;

const SkeletonBooks = ({ viewType }) => (
  <BooksWrapper viewType={viewType}>
    {Array.from({ length: SkeletonBookCount }, (_, index) =>
      viewType === ViewType.PORTRAIT ? (
        <div key={index} className="Book" css={styles.portrait}>
          <PortraitBook />
        </div>
      ) : (
        <div key={index} className="Book" css={styles.landscape}>
          <LandscapeBook />
        </div>
      ),
    )}
  </BooksWrapper>
);

export default React.memo(SkeletonBooks);
