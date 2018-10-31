import { Book } from '@ridi/rsg';
import classNames from 'classnames';
import { ServiceType } from '../../constants';
import { isExpired } from '../../utils/datetime';

import { portraitBookCSS, bookCss } from './styles';
import {
  UnitCount,
  RidiSelectBand,
  ExpireDate,
  ExpiredCover,
} from './components';

const LibraryBook = ({ item, book }) => {
  const _isExpired =
    isExpired(item.expire_date) && ServiceType.isExpirable(item.service_type);
  const hasItems = item.unit_count > 1;
  const isRidiSelect = ServiceType.isRidiselect(item.service_type);
  return (
    <div className={bookCss}>
      <Book
        className={classNames('RSGBook-preset-portrait', portraitBookCSS)}
        dto={book}>
        {({ Thumbnail, Metadata }) => (
          <>
            <Thumbnail.wrapper thumbnailSize={90} link="unused">
              <Thumbnail.coverImage />
              <Thumbnail.setBooklet />
              <Thumbnail.adultOnlyBadge />
              {_isExpired && (
                <ExpiredCover
                  isRidiSelect={isRidiSelect}
                  hasItems={hasItems}
                  isLandscape={false}
                />
              )}
              {isRidiSelect && !hasItems && <RidiSelectBand />}
              {hasItems && (
                <UnitCount
                  item={item}
                  unit={book.series && book.series.property.unit}
                />
              )}
            </Thumbnail.wrapper>
            <Metadata.wrapper>
              <Metadata.title link="unused" />
              <ExpireDate
                expireDate={item.expire_date}
                serviceType={item.service_type}
                isExpired={_isExpired}
              />
            </Metadata.wrapper>
          </>
        )}
      </Book>
    </div>
  );
};

export default LibraryBook;
