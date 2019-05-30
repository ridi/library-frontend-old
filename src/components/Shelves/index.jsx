/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ShelvesWrapper } from '../ShelvesWrapper';
import Shelf from '../Shelf';

export const Shelves = ({ shelfIds }) => (
  <ShelvesWrapper>
    {shelfIds.map(uuid => (
      <div key={uuid} className="shelf">
        <Shelf uuid={uuid} />
      </div>
    ))}
  </ShelvesWrapper>
);
