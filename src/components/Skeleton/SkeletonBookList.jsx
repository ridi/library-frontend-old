import React from 'react';
import BookList from '../BookList';
import SkeletonBook from './SkeletonBook';
import BookWrapper from '../BookWrapper';

const SkeletonBookList = () => (
  <BookList>
    <BookWrapper>
      <SkeletonBook />
    </BookWrapper>
    <BookWrapper>
      <SkeletonBook />
    </BookWrapper>
    <BookWrapper>
      <SkeletonBook />
    </BookWrapper>
    <BookWrapper>
      <SkeletonBook />
    </BookWrapper>
    <BookWrapper>
      <SkeletonBook />
    </BookWrapper>
    <BookWrapper>
      <SkeletonBook />
    </BookWrapper>
    <BookWrapper>
      <SkeletonBook />
    </BookWrapper>
    <BookWrapper>
      <SkeletonBook />
    </BookWrapper>
    <BookWrapper>
      <SkeletonBook />
    </BookWrapper>
  </BookList>
);

export default SkeletonBookList;
