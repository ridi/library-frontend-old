import moment from 'moment-timezone';

// add timezone data
moment.tz.add(
  // eslint-disable-next-line max-len
  'Asia/Seoul|LMT KST JST KST KDT KDT|-8r.Q -8u -90 -90 -9u -a0|0123141414141414135353|-2um8r.Q 97XV.Q 1m1zu kKo0 2I0u OL0 1FB0 Rb0 1qN0 TX0 1tB0 TX0 1tB0 TX0 1tB0 TX0 2ap0 12FBu 11A0 1o00 11A0|23e6',
);

// php-core의 DateUtil::timeLeft() 기준 참고 (https://gitlab.ridi.io/common/php-core/blob/v0.9.x/src/Library/DateUtil.php#L71)
export const timeLeft = date => {
  const target = moment(date);

  if (!target.isAfter()) {
    return '';
  }

  const duration = moment.duration(target.diff(Date.now()));
  const years = duration.years();
  const days = Math.floor(duration.subtract(years, 'y').asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${[years && `${years}년`, days && `${days}일`, hours && !years && `${hours}시간`, minutes && !years && !days && `${minutes}분`]
    .filter(t => !!t)
    .join(' ')}`;
};

export const formatExpiredDate = date => `${moment(date).format('YYYY.MM.DD.')} 만료`;
export const isExpired = date => !moment(date).isAfter();

const dateWithTimezone = date => moment.tz(date, 'Asia/Seoul');

export const isNowBetween = (start, end) => {
  const now = dateWithTimezone(moment());
  const startDate = dateWithTimezone(start);
  const endDate = dateWithTimezone(end);

  return now.isBetween(startDate, endDate);
};
