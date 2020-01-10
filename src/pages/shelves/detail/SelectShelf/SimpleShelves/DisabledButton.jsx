import React from 'react';
import { useDispatch } from 'react-redux';

import { ITEMS_LIMIT_PER_SHELF } from 'constants/shelves';
import * as toastActions from 'services/toast/actions';
import { ToastStyle } from 'services/toast/constants';

import * as styles from './styles';

const DisabledButton = () => {
  const dispatch = useDispatch();
  const handleDisabledButtonClick = () => {
    dispatch(
      toastActions.showToast({
        message: `최대 ${ITEMS_LIMIT_PER_SHELF}권까지 추가할 수 있습니다.`,
        toastStyle: ToastStyle.BLUE,
      }),
    );
  };

  return (
    <button css={styles.disabledButton} type="button" onClick={handleDisabledButtonClick}>
      <span className="a11y">선택불가 책장 선택</span>
    </button>
  );
};

export default DisabledButton;
