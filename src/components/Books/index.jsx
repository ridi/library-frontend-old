import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getResponsiveBookSizeForBookList } from 'commonStyles/responsive';
import BooksWrapper from 'components/BooksWrapper';
import ViewType from 'constants/viewType';

import EmptyLandscapeBook from './EmptyLandscapeBook';
import BookItem from './BookItem';
import MobxBookItem from 'components/Books/MobxBookItem';
import { observer } from 'mobx-react';

export function Books(props) {
  const { isSelectMode, isSeriesView, libraryBookDTO, linkBuilder, viewType: givenViewType, inactiveBookUnitIds, onSelectedChange } = props;
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

  let books;
  let renderBook;
  if (libraryBookDTO != null) {
    const finalBookIds = libraryBookDTO.map(book => book.b_id);
    const libraryBookMap = new Map(libraryBookDTO.map(book => [book.b_id, book]));

    books = finalBookIds;
    renderBook = ({ book: bookId, className }) => {
      const libraryBookData = libraryBookMap.get(bookId);
      const { purchase_date: purchaseDate, unit_id: unitId } = libraryBookData;
      const isPurchased = !!purchaseDate;
      let inactive = !isPurchased;
      // 구매한 책이더라도 inactiveBookUnitIds 에 포함되어 있다면 비활성화 처리
      if (isPurchased && !!inactiveBookUnitIds) {
        inactive = inactiveBookUnitIds.some(inactiveBookUniId => inactiveBookUniId === unitId);
      }

      return (
        <BookItem
          key={bookId}
          bookId={bookId}
          className={className}
          isSelectMode={isSelectMode}
          isSeriesView={isSeriesView}
          libraryBookData={libraryBookData}
          linkBuilder={linkBuilder}
          thumbnailWidth={thumbnailWidth}
          viewType={viewType}
          inactive={inactive}
          onSelectedChange={onSelectedChange}
        />
      );
    };
  } else {
    books = [];
    renderBook = null;
  }

  const libraryBooksCount = books.length;
  const isNeedLandscapeBookSeparator = viewType === ViewType.LANDSCAPE && libraryBooksCount % 2 !== 0;
  const bookNodes = books.map(book => renderBook({ book, className: 'Book' }));

  return (
    <BooksWrapper viewType={viewType}>
      {bookNodes}
      {isNeedLandscapeBookSeparator && <EmptyLandscapeBook />}
    </BooksWrapper>
  );
}

export const MobxBooks = observer(function MobxBooks(props) {
  const { page, isSelectMode, isSeriesView, linkBuilder, viewType: givenViewType, inactiveBookUnitIds, onSelectedChange } = props;
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

  const books = page.items;
  const renderBook = ({ book, className }) => {
    const isPurchased = Boolean(book.purchaseDate);
    let inactive = !isPurchased;
    // 구매한 책이더라도 inactiveBookUnitIds 에 포함되어 있다면 비활성화 처리
    if (isPurchased && !!inactiveBookUnitIds) {
      inactive = inactiveBookUnitIds.some(inactiveBookUniId => inactiveBookUniId === unitId);
    }
    return (
      <MobxBookItem
        key={book.book.id}
        book={book}
        className={className}
        isSelectMode={isSelectMode}
        isSeriesView={isSeriesView}
        linkBuilder={linkBuilder}
        thumbnailWidth={thumbnailWidth}
        viewType={viewType}
        inactive={inactive}
        onSelectedChange={onSelectedChange}
      />
    );
  };

  const libraryBooksCount = books.length;
  const isNeedLandscapeBookSeparator = viewType === ViewType.LANDSCAPE && libraryBooksCount % 2 !== 0;
  const bookNodes = books.map(book => renderBook({ book, className: 'Book' }));

  return (
    <BooksWrapper viewType={viewType}>
      {bookNodes}
      {isNeedLandscapeBookSeparator && <EmptyLandscapeBook />}
    </BooksWrapper>
  );
});
