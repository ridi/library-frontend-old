import React from 'react';
import shortid from 'shortid';
import BookList from '../BookList';
import { SkeletonBook } from './components';
import BookWrapper from '../BookWrapper';

const SkeletonBookCount = 24;

const SkeletonBookList = () => (
  <BookList>
    {Array(SkeletonBookCount)
      .fill(1)
      .map(() => (
        <BookWrapper key={shortid.generate()}>
          <SkeletonBook />
        </BookWrapper>
      ))}
  </BookList>
);

export default SkeletonBookList;
