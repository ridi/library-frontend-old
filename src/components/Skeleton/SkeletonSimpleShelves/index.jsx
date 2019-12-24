import React from 'react';

import SimpleShelvesWrapper from 'components/SimpleShelvesWrapper';

import SkeletonSimpleShelf from './SkeletonSimpleShelf';

const SKELETON_TOTAL_COUNT = 40;
const SkeletonSimpleShelves = () => {
  const renderSkeletonShelf = renderItem =>
    Array.from({ length: SKELETON_TOTAL_COUNT }).map((_, index) =>
      renderItem({
        key: `simpleShelfSkeleton_${index}`,
        item: <SkeletonSimpleShelf />,
      }),
    );
  return <SimpleShelvesWrapper renderList={renderSkeletonShelf} />;
};

export default SkeletonSimpleShelves;
