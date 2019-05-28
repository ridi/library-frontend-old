/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ShelvesWrapper } from '../ShelvesWrapper';
import { Shelf } from '../Shelf';

export const Shelves = ({ shelves }) => (
  <ShelvesWrapper>
    {shelves.map(shelf => (
      <div key={shelf.id} className="shelf">
        <Shelf {...shelf} />
      </div>
    ))}
  </ShelvesWrapper>
);
