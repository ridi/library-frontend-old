

export const getBooks = bookIds => {
  return state => {
    if (bookIds.length === 0) {
      return [];
    }
    return bookIds.map(bookId => state.books.books.get(bookId)).filter(value => value);
  };
};
