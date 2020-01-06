import React from 'react';

import SimpleShelvesWrapper from 'components/SimpleShelvesWrapper';
import SimpleShelvesItem from 'components/SimpleShelvesWrapper/SimpleShelvesItem';

import SkeletonSimpleShelf from './SkeletonSimpleShelf';

const SKELETON_TOTAL_COUNT = 40;
const skeletonIndex = Array.from({ length: SKELETON_TOTAL_COUNT }, (_, index) => index);

const SkeletonSimpleShelves = () => {
  const renderSkeletonShelf = () =>
    skeletonIndex.map(index => (
      <SimpleShelvesItem key={`simpleShelfSkeleton_${index}`}>
        <SkeletonSimpleShelf />
      </SimpleShelvesItem>
    ));

  return <SimpleShelvesWrapper>{renderSkeletonShelf()}</SimpleShelvesWrapper>;
};

export default SkeletonSimpleShelves;
