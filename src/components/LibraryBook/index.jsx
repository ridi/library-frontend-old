/** @jsx jsx */
import Link from 'next/link';
import { jsx } from '@emotion/core';
import { Book } from '@ridi/rsg';
import { ServiceType } from '../../constants/serviceType';
import { isExpired } from '../../utils/datetime';

import { portraitBookCSS, bookCss } from './styles';
import { UnitCount, RidiSelectBand, ExpireDate, ExpiredCover } from './components';

const LibraryBook = ({ item, book, isEditing, checked, href, as, onChangeCheckbox }) => {
  const _isExpired = isExpired(item.expire_date) && ServiceType.isExpirable(item.service_type);
  const hasItems = item.unit_count > 1;
  const isRidiSelect = ServiceType.isRidiselect(item.service_type);

  return (
    <div css={bookCss}>
      {isEditing ? (
        <label onClick={e => e.stopPropagation()}>
          {checked ? '선택됨' : '선택해제됨'}
          <input type="checkbox" checked={checked} onChange={onChangeCheckbox} />
        </label>
      ) : null}
      <Book css={portraitBookCSS} className="RSGBook-preset-portrait" dto={book}>
        {({ Thumbnail, Metadata }) => (
          <>
            <Link href={href} as={as}>
              <a>
                <Thumbnail.wrapper thumbnailSize={90} link="unused">
                  <Thumbnail.coverImage />
                  <Thumbnail.setBooklet />
                  <Thumbnail.adultOnlyBadge />
                  {_isExpired && <ExpiredCover isRidiSelect={isRidiSelect} hasItems={hasItems} isLandscape={false} />}
                  {isRidiSelect && !hasItems && <RidiSelectBand />}
                  {hasItems && <UnitCount item={item} unit={book.series && book.series.property.unit} />}
                </Thumbnail.wrapper>
              </a>
            </Link>
            <Link href={href} as={as}>
              <a>
                <Metadata.wrapper>
                  <Metadata.title link="unused" />
                  <ExpireDate expireDate={item.expire_date} serviceType={item.service_type} isExpired={_isExpired} />
                </Metadata.wrapper>
              </a>
            </Link>
          </>
        )}
      </Book>
    </div>
  );
};

export default LibraryBook;
