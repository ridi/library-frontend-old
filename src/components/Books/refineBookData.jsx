import { Book } from '@ridi/web-ui';
import isAfter from 'date-fns/is_after';

import { UnitType } from 'constants/unitType';
import ViewType from 'constants/viewType';
import BookMetaData from 'utils/bookMetaData';
import adultCover from 'static/cover/adult.png';

const refineBookData = ({
  libraryBookData,
  platformBookData,
  unitData,
  isSelectMode,
  isSelected,
  onSelectedChange,
  viewType,
  linkBuilder,
  showUpdateBadge,
  thumbnailWidth,
  isVerifiedAdult,
}) => {
  const {
    unit_count: bookCount,
    remain_time: expiredAt,
    expire_date: expireDate,
    is_ridiselect: isRidiselect,
    unit_type: unitType,
    unit_title: unitTitle,
    purchase_date: purchaseDate,
  } = libraryBookData;
  const bookMetaData = new BookMetaData(platformBookData);

  const bookCountUnit = platformBookData.series?.property?.unit || Book.BookCountUnit.Single;
  const isAdultOnly = platformBookData.property.is_adult_only;
  const isExpired = !isRidiselect && expireDate && isAfter(new Date(), expireDate);
  const isNotAvailable = expireDate ? isAfter(new Date(), expireDate) : false;
  const isPurchasedBook = !!purchaseDate;
  const isUnitBook = unitType && !UnitType.isBook(unitType);
  const unit = unitData;

  const isRidiselectSingleUnit = isRidiselect && isUnitBook && bookCount === 1;

  const thumbnailLink = linkBuilder ? linkBuilder(libraryBookData, platformBookData) : null;

  const unitBookCount = bookCount && <Book.UnitBookCount bookCount={bookCount} bookCountUnit={bookCountUnit} />;
  const title = unit ? unit.title : unitTitle || platformBookData.title.main;

  const thumbnailUrl = isAdultOnly && !isVerifiedAdult ? adultCover : `${platformBookData.thumbnail.large}?dpi=xhdpi`;

  const defaultBookProps = {
    thumbnailTitle: `${title} 표지`,
    thumbnailUrl,
    adultBadge: isAdultOnly,
    expired: isExpired,
    notAvailable: isNotAvailable,
    updateBadge: showUpdateBadge,
    ridiselect: isRidiselect,
    selectMode: isSelectMode && isPurchasedBook,
    selected: isSelected,
    unitBook: isUnitBook && !isRidiselectSingleUnit,
    unitBookCount,
    onSelectedChange,
    thumbnailLink,
  };

  const portraitBookProps = {
    thumbnailWidth,
    expiredAt,
  };
  const landscapeBookProps = {
    title,
    author: bookMetaData.authorsSimple,
    thumbnailWidth: 60,
    expiredAt,
  };

  return {
    isPurchasedBook,
    libraryBookProps: {
      ...defaultBookProps,
      ...(viewType === ViewType.LANDSCAPE ? landscapeBookProps : portraitBookProps),
    },
    thumbnailLink,
  };
};

export default refineBookData;
