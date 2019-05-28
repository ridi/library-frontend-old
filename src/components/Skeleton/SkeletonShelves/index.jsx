/** @jsx jsx */
import { jsx } from '@emotion/core';
import { skeletonShelvesStyle } from './styles';
import { ShelvesWrapper } from '../../ShelvesWrapper';

const SKELETON_TOTAL_COUNT = 20;
export const SkeletonShelves = () => (
  <ShelvesWrapper>
    {Array.from({ length: SKELETON_TOTAL_COUNT }, (_, index) => (
      <div key={`SkeletonShelves-${index}`} css={skeletonShelvesStyle}>
        Now Loading
      </div>
    ))}
  </ShelvesWrapper>
);
