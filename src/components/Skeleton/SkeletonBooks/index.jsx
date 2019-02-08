/** @jsx jsx */
import { jsx } from '@emotion/core';
import shortid from 'shortid';
import ViewType from '../../../constants/viewType';
import * as styles from '../../../styles/books';
import BooksWrapper from '../../BooksWrapper';
import LandscapeBook from './LandscapeBook';
import PortraitBook from './PortraitBook';

const SkeletonBookCount = 48;

const SkeletonBooks = ({ viewType }) => (
  <BooksWrapper
    viewType={viewType}
    renderBooks={({ className }) =>
      Array(SkeletonBookCount)
        .fill()
        .map(() =>
          viewType === ViewType.PORTRAIT ? (
            <div key={shortid.generate()} className={className} css={styles.portrait}>
              <PortraitBook />
            </div>
          ) : (
            <div key={shortid.generate()} className={className} css={styles.landscape}>
              <LandscapeBook />
            </div>
          ),
        )
    }
  />
);

export default SkeletonBooks;
