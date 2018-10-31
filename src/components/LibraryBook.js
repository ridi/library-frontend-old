import { Book } from '@ridi/rsg';

const LibraryBook = ({ item, book }) => (
  <Book dto={book}>
    {({ Thumbnail, Metadata }) => (
      <>
        <Thumbnail.wrapper thumbnailSize={90} link="unused">
          <Thumbnail.coverImage />
          <Thumbnail.setBooklet />
          <Thumbnail.adultOnlyBadge />
        </Thumbnail.wrapper>
        <Metadata.wrapper>
          <Metadata.title link="unused" />
          <Metadata.authors simple />
          {item.purchase_date}
          {item.expire_date}
          {item.service_type}
        </Metadata.wrapper>
      </>
    )}
  </Book>
);

export default LibraryBook;
