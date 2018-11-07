import { Icon } from '@ridi/rsg';
import classNames from 'classnames';

import { ServiceType } from '../../constants/serviceType';
import { timeLeft, formatExpiredDate, isExpired } from '../../utils/datetime';

import {
  unitCountCss,
  expireDateExpiredCss,
  bandCss,
  bandIconCss,
  bandTextCss,
  unitCountTextCss,
  unitCountIconCss,
  expireDateTextCss,
  expireDateIconCss,
  expiredBandIconCss,
  ridiselectBandIconCss,
} from './styles';

export const UnitCount = ({ item, unit = '권' }) => (
  <div className={unitCountCss}>
    <span className={unitCountTextCss}>
      총 {item.unit_count} {unit}
      <Icon name="arrow_1_right" className={unitCountIconCss} />
    </span>
  </div>
);

export const ExpireDate = ({ expireDate, serviceType, isExpired: _isExpired }) =>
  ServiceType.isExpirable(serviceType) ? (
    <div
      className={classNames(expireDateTextCss, {
        [expireDateExpiredCss]: isExpired,
      })}>
      <Icon
        name="timer"
        className={classNames(expireDateIconCss, {
          [expireDateExpiredCss]: _isExpired,
        })}
      />
      {_isExpired ? formatExpiredDate(expireDate) : timeLeft(expireDate)}
    </div>
  ) : null;

export const ExpiredBand = () => (
  <p className={bandCss}>
    <Icon name="timer" className={classNames(bandIconCss, expiredBandIconCss)} />
    <span className={bandTextCss}>기간 만료</span>
  </p>
);

export const ExpiredCover = ({ isRidiSelect, hasItems, isLandscape }) => (
  <div className="LibraryBook_ExpiredCover">
    <span className="LibraryBook_ExpiredCover_Icon" />
    {isLandscape ? !isRidiSelect && <ExpiredBand /> : !isRidiSelect && !hasItems && <ExpiredBand />}
  </div>
);

export const RidiSelectBand = () => (
  <div className={bandCss}>
    <Icon name="book_1" className={classNames(bandIconCss, ridiselectBandIconCss)} />
    <span className={bandTextCss}>리디셀렉트</span>
  </div>
);
