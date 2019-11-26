import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getResponsiveBookSizeForBookList } from 'commonStyles/responsive';
import BooksWrapper from 'components/BooksWrapper';
import ViewType from 'constants/viewType';

import EmptyLandscapeBook from './EmptyLandscapeBook';
import BookItem from './BookItem';

export function Books(props) {
  const { isSelectMode, isSeriesView, libraryBookDTO, linkBuilder, viewType: givenViewType } = props;

  const viewType = useSelector(state => givenViewType || state.ui.viewType);
  const isLoaded = true;
  const [thumbnailWidth, setThumbnailWidth] = useState(100);
  const setResponsiveThumbnailWidth = () => {
    setThumbnailWidth(getResponsiveBookSizeForBookList(window.innerWidth).width);
  };
  useEffect(() => {
    setResponsiveThumbnailWidth();
    window.addEventListener('resize', setResponsiveThumbnailWidth);
    return () => {
      window.removeEventListener('resize', setResponsiveThumbnailWidth);
    };
  }, [isLoaded]);

  let finalBookIds = [];
  let libraryBookMap = new Map();
  if (libraryBookDTO != null) {
    finalBookIds = libraryBookDTO.map(book => book.b_id);
    libraryBookMap = new Map(libraryBookDTO.map(book => [book.b_id, book]));
  }
  return (
    <BooksWrapper
      viewType={viewType}
      books={finalBookIds}
      renderBook={({ book: bookId, className }) => (
        <BookItem
          key={bookId}
          bookId={bookId}
          className={className}
          isSelectMode={isSelectMode}
          isSeriesView={isSeriesView}
          libraryBookData={libraryBookMap.get(bookId)}
          linkBuilder={linkBuilder}
          thumbnailWidth={thumbnailWidth}
          viewType={viewType}
        />
      )}
    >
      {({ books }) => {
        const libraryBooksCount = finalBookIds.length;
        const isNeedLandscapeBookSeparator = viewType === ViewType.LANDSCAPE && libraryBooksCount % 2 !== 0;

        return (
          <>
            {books}
            {isNeedLandscapeBookSeparator && <EmptyLandscapeBook />}
          </>
        );
      }}
    </BooksWrapper>
  );
}
