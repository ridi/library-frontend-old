import React from 'react';

import SimpleShelvesWrapper from 'components/SimpleShelvesWrapper';
import SimpleShelfList from 'components/SimpleShelvesWrapper/SimpleShelfList';

import SkeletonSimpleShelf from './SkeletonSimpleShelf';

const SKELETON_TOTAL_COUNT = 40;
const SkeletonSimpleShelves = () => {
  const renderSkeletonShelf = () =>
    Array.from({ length: SKELETON_TOTAL_COUNT }).map(() => (
      <SimpleShelfList key={`simpleShelfSkeleton_${Math.random()}`}>
        <SkeletonSimpleShelf />
      </SimpleShelfList>
    ));

  return <SimpleShelvesWrapper>{renderSkeletonShelf()}</SimpleShelvesWrapper>;
};

export default SkeletonSimpleShelves;
