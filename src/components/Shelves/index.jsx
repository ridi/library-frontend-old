/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ShelvesWrapper } from '../ShelvesWrapper';
import Shelf from '../Shelf';

export const Shelves = ({ shelfIds, selectMode }) => (
  <ShelvesWrapper>
    {shelfIds.map(uuid => (
      <div key={uuid} className="shelf">
        <Shelf uuid={uuid} selectMode={selectMode} />
      </div>
    ))}
  </ShelvesWrapper>
);
