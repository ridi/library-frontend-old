import { ServiceType } from '../../constants/serviceType';

// TODO: 컴포넌트 업데이트 전까지 임시적으로 처리한다.
export function getRemainTime(libraryItem) {
  if (!libraryItem) {
    return '';
  }

  if (libraryItem.remain_time !== '') {
    return libraryItem.remain_time;
  }

  if (libraryItem.service_type === ServiceType.SELECT) {
    return '';
  }

  // 사용기간이 있으면
  return libraryItem.expire_date === '9999-12-31T23:59:59+09:00' ? '구매한 책' : '대여했던 책';
}
