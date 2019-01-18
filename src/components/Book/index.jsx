import { Book } from '@ridi/web-ui/dist/index.node';
import React from 'react';

export const PortraitBook = ({
  bookId,
  isAdult,
  // isUpdate,
  isRidiselect,
  // isExpired,
  // isNotAvailable,
  // isUnitBook,
  // bookCount,
  isSelectMode,
  isSelected,
  onSelectedChange,
}) => (
  // <p>{bookId}</p>
  <Book.PortraitBook
    thumbnailUrl={`https://misc.ridibooks.com/cover/${bookId}/xxlarge?dpi=xxhdpi`}
    adultBadge={isAdult}
    // updateBadge={isUpdate}
    ridiselect={isRidiselect}
    // expired={isExpired}
    // notAvailable={isNotAvailable}
    // unitBook={isUnitBook}
    // renderUnitBookCount={() => <Book.UnitBookCount bookCount={bookCount} bookCountUnit={Book.BookCountUnit.Single} />}
    selectMode={isSelectMode}
    selected={isSelected}
    onSelectedChange={onSelectedChange}
  />
);
