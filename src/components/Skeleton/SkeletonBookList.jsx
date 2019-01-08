import React from 'react';
import BookList from '../BookList';
import SkeletonBook from './SkeletonBook';
import BookWrapper from '../BookWrapper';

const SkeletonBookCount = 24;

const SkeletonBookList = () => (
  <BookList>
    {Array(SkeletonBookCount)
      .fill(1)
      .map(() => (
        <BookWrapper>
          <SkeletonBook />
        </BookWrapper>
      ))}
  </BookList>
);

export default SkeletonBookList;
