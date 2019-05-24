/** @jsx jsx */
import { jsx } from '@emotion/core';
import { skeletonShelvesStyle } from './styles';

const SKELETON_TOTAL_COUNT = 20;
export const SkeletonShelves = () =>
  Array.from({ length: SKELETON_TOTAL_COUNT }, (_, index) => (
    <div key={`SkeletonShelves-${index}`} css={skeletonShelvesStyle}>
      Now Loading
    </div>
  ));
