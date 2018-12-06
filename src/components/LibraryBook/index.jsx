import { Book } from '@ridi/rsg';
import classNames from 'classnames';
import { ServiceType } from '../../constants/serviceType';
import { isExpired } from '../../utils/datetime';

import { portraitBookCSS, bookCss } from './styles';
import { UnitCount, RidiSelectBand, ExpireDate, ExpiredCover } from './components';

const LibraryBook = ({ item, book, isEditing, checked, onChangeCheckbox }) => {
  const _isExpired = isExpired(item.expire_date) && ServiceType.isExpirable(item.service_type);
  const hasItems = item.unit_count > 1;
  const isRidiSelect = ServiceType.isRidiselect(item.service_type);

  // Thumbnail과 Meta를 Focusing하기 위해 button으로 Wrapping 했다.
  // 후에 Link로 변경 하자
  return (
    <div className={bookCss}>
      {isEditing ? (
        <label onClick={e => e.stopPropagation()}>
          {checked ? '선택됨' : '선택해제됨'}
          <input type="checkbox" checked={checked} onChange={onChangeCheckbox} />
        </label>
      ) : null}
      <Book className={classNames('RSGBook-preset-portrait', portraitBookCSS)} dto={book}>
        {({ Thumbnail, Metadata }) => (
          <>
            <button type="button">
              <Thumbnail.wrapper thumbnailSize={90} link="unused">
                <Thumbnail.coverImage />
                <Thumbnail.setBooklet />
                <Thumbnail.adultOnlyBadge />
                {_isExpired && <ExpiredCover isRidiSelect={isRidiSelect} hasItems={hasItems} isLandscape={false} />}
                {isRidiSelect && !hasItems && <RidiSelectBand />}
                {hasItems && <UnitCount item={item} unit={book.series && book.series.property.unit} />}
              </Thumbnail.wrapper>
            </button>
            <button type="button">
              <Metadata.wrapper>
                <Metadata.title link="unused" />
                <ExpireDate expireDate={item.expire_date} serviceType={item.service_type} isExpired={_isExpired} />
              </Metadata.wrapper>
            </button>
          </>
        )}
      </Book>
    </div>
  );
};

export default LibraryBook;