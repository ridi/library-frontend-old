/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Icon } from '@ridi/rsg';
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
  <div css={unitCountCss}>
    <span css={unitCountTextCss}>
      총 {item.unit_count} {unit}
      <Icon name="arrow_1_right" css={unitCountIconCss} />
    </span>
  </div>
);

export const ExpireDate = ({ expireDate, serviceType, isExpired: _isExpired }) =>
  ServiceType.isExpirable(serviceType) ? (
    <div css={[expireDateTextCss, isExpired && expireDateExpiredCss]}>
      <Icon name="timer" css={[expireDateIconCss, _isExpired && expireDateExpiredCss]} />
      {_isExpired ? formatExpiredDate(expireDate) : timeLeft(expireDate)}
    </div>
  ) : null;

export const ExpiredBand = () => (
  <p css={bandCss}>
    <Icon name="timer" css={[bandIconCss, expiredBandIconCss]} />
    <span css={bandTextCss}>기간 만료</span>
  </p>
);

export const ExpiredCover = ({ isRidiSelect, hasItems, isLandscape }) => (
  <div className="LibraryBook_ExpiredCover">
    <span className="LibraryBook_ExpiredCover_Icon" />
    {isLandscape ? !isRidiSelect && <ExpiredBand /> : !isRidiSelect && !hasItems && <ExpiredBand />}
  </div>
);

export const RidiSelectBand = () => (
  <div css={bandCss}>
    <Icon name="book_1" css={[bandIconCss, ridiselectBandIconCss]} />
    <span css={bandTextCss}>리디셀렉트</span>
  </div>
);
