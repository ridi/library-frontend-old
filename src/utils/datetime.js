import moment from 'moment';

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

  return `${[
    years && `${years}년`,
    days && `${days}일`,
    hours && !years && `${hours}시간`,
    minutes && !years && !days && `${minutes}분`,
  ]
    .filter(t => !!t)
    .join(' ')} 남음`;
};

export const formatExpiredDate = date => `${moment(date).format('YYYY.MM.DD.')} 만료`;
export const isExpired = date => !moment(date).isAfter();
