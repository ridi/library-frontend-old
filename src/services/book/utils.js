

export function getExpiredBookIds (targetBookIds, books, criterion) {
  return targetBookIds.reduce((previous, bookId) => {
    const book = books[bookId];

    if (!book) {
      return previous;
    }

    if (book.ttl > criterion) {
      return previous;
    }
    
    return [
      ...previous, book.id,
    ]
  }, []);
};


export function getNotExistBookIds (bookIds, existBooks) {
  return bookIds.reduce((previous, current) => {
    const existBook = existBooks[current];
    
    // 기존의 책이 없을때
    if (!existBook) {
      return [
        ...previous,
        current,
      ];
    }

    return previous;
  }, []);
}