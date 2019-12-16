import { Instance } from 'mobx-state-tree';

import ViewType from 'constants/viewType';
import adultCover from 'static/cover/adult.png';

import { Item } from '../../models/items';

interface BookDataInput {
  item: Instance<typeof Item>;
  isSelectMode: boolean;
  isSelected: boolean;
  onSelectedChange?(): void;
  viewType: ViewType;
  linkBuilder?(item: Instance<typeof Item>): React.ReactNode;
  showUpdateBadge: boolean;
  thumbnailWidth: number;
  isVerifiedAdult: boolean;
  inactive: boolean;
}

const refineBookData = ({
  item,
  isSelectMode,
  isSelected,
  onSelectedChange,
  viewType,
  linkBuilder,
  showUpdateBadge,
  thumbnailWidth,
  isVerifiedAdult,
  inactive,
}: BookDataInput) => {
  const { bookCountNode: unitBookCount, remainTime: expiredAt, isRidiselect, isExpired, isNotAvailable, isRidiselectSingleUnit } = item;
  const { title, isBook: isUnitBook } = item.unit;
  const { isAdultOnly } = item.book;

  const thumbnailLink = linkBuilder ? linkBuilder(item) : null;
  const thumbnailUrl = isAdultOnly && !isVerifiedAdult ? adultCover : item.book.thumbnailUrl;

  const defaultBookProps = {
    thumbnailTitle: `${title} 표지`,
    thumbnailUrl,
    adultBadge: isAdultOnly,
    expired: isExpired,
    notAvailable: isNotAvailable,
    updateBadge: showUpdateBadge,
    ridiselect: isRidiselect,
    selectMode: isSelectMode && !inactive,
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
    author: item.book.authorsSimple,
    thumbnailWidth: 60,
    expiredAt,
  };

  return {
    libraryBookProps: {
      ...defaultBookProps,
      ...(viewType === ViewType.LANDSCAPE ? landscapeBookProps : portraitBookProps),
    },
    thumbnailLink,
  };
};

export default refineBookData;
