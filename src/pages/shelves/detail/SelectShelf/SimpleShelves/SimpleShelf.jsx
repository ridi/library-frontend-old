import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as selectionSelectors from 'services/selection/selectors';
import { ITEMS_LIMIT_PER_SHELF } from 'constants/shelves';
import * as shelfSelectors from 'services/shelf/selectors';
import * as toastActions from 'services/toast/actions';
import { ToastStyle } from 'services/toast/constants';
import CheckCircle from 'svgs/CheckCircle.svg';

import * as styles from './styles';

const SimpleShelf = ({ shelfId, isSelect, handleShelfSelectChange }) => {
  const dispatch = useDispatch();
  const shelfName = useSelector(state => shelfSelectors.getShelfName(state, shelfId));
  const shelfBookCount = useSelector(state => shelfSelectors.getShelfBookCount(state, shelfId));
  const selectedBookCount = useSelector(selectionSelectors.getTotalSelectedCount);
  const disabled = shelfBookCount + selectedBookCount >= ITEMS_LIMIT_PER_SHELF;
  const buttonLabel = disabled ? '선택 불가 책장' : `${shelfName} 선택`;
  const handleListClick = () => {
    if (disabled) {
      dispatch(
        toastActions.showToast({
          message: `최대 ${ITEMS_LIMIT_PER_SHELF}권까지 추가할 수 있습니다.`,
          toastStyle: ToastStyle.BLUE,
          withBottomFixedButton: true,
        }),
      );
    }
  };

  return (
    <div css={[styles.simpleShelf, disabled && styles.disabledShelf]}>
      <label css={styles.radioButtonLabel} onClick={handleListClick}>
        <input
          type="radio"
          name="simpleShelves"
          css={styles.invisibleRadioInput}
          onChange={() => {
            handleShelfSelectChange(shelfId);
          }}
          disabled={disabled}
        />
        <span className="a11y">{buttonLabel}</span>
      </label>
      <div css={styles.shelfCheckIconWrapper}>
        <div css={[styles.checkButton, disabled && styles.disabledCheckButton]}>
          <span css={[styles.checkIconBorder, isSelect && styles.checked]} />
          <CheckCircle css={styles.checkIcon} />
        </div>
      </div>
      <div css={styles.shelfMetaWrapper}>
        <p css={styles.shelfName}>{shelfName}</p>
        <p css={styles.shelfBookCount}>{shelfBookCount > 0 ? shelfBookCount : ''}</p>
      </div>
    </div>
  );
};

export default SimpleShelf;
