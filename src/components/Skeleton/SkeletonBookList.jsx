import React from 'react';
import shortid from 'shortid';
import BookList from '../BookList';
import { SkeletonPortraitBook, SkeletonLandscapeBook } from './components';
import { PortraitBookWrapper, LandscapeBookWrapper } from '../BookWrapper';

const SkeletonBookCount = 48;

const SkeletonBookList = () => (
  <BookList>
    {Array(SkeletonBookCount)
      .fill()
      .map(() => (
        <PortraitBookWrapper key={shortid.generate()}>
          <SkeletonPortraitBook />
        </PortraitBookWrapper>
      ))}
  </BookList>
);

export default SkeletonBookList;
