import React from 'react';
import shortid from 'shortid';
import BookList from '../BookList';
import { SkeletonPortraitBook, SkeletonLandscapeBook } from './components';
import { PortraitBookWrapper, LandscapeBookWrapper } from '../BookWrapper';
import ViewType from '../../constants/viewType';

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
