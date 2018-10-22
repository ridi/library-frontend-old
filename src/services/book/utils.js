

export function getExpiredBookIds (books, criterionTTL) {
  return Object.keys(books).reduce((previous, current) => {
    const book = books[current];
    if (book.ttl < criterionTTL) {
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