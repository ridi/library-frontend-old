import React from 'react';
import shortid from 'shortid';
import ViewType from '../../constants/viewType';
import { LandscapeBookWrapper, PortraitBookWrapper } from '../BookWrapper';
import BookList from './BookList';
import { SkeletonLandscapeBook, SkeletonPortraitBook } from './components';

const SkeletonBookCount = 48;

const SkeletonBookList = (viewType = ViewType.PORTRAIT) => (
  <BookList viewType={viewType}>
    {Array(SkeletonBookCount)
      .fill()
      .map(() =>
        viewType === ViewType.PORTRAIT ? (
          <PortraitBookWrapper key={shortid.generate()}>
            <SkeletonPortraitBook />
          </PortraitBookWrapper>
        ) : (
          <LandscapeBookWrapper key={shortid.generate()}>
            <SkeletonLandscapeBook />
          </LandscapeBookWrapper>
        ),
      )}
  </BookList>
);

export default SkeletonBookList;
