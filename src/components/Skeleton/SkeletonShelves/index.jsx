import { skeletonShelvesStyle } from './styles';
import { ShelvesWrapper } from '../../ShelvesWrapper';

const SKELETON_TOTAL_COUNT = 24;
export const SkeletonShelves = () => (
  <ShelvesWrapper>
    {Array.from({ length: SKELETON_TOTAL_COUNT }, (_, index) => (
      <div key={`SkeletonShelves-${index}`} className="shelf">
        <p css={skeletonShelvesStyle}>
          <span className="a11y">Now Loading</span>
        </p>
      </div>
    ))}
  </ShelvesWrapper>
);
