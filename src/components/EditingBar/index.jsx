/** @jsx jsx */
import { jsx } from '@emotion/core';
import Responsive from '../../pages/base/Responsive';
import Check from '../../svgs/Check.svg';
import * as styles from './styles';

const EditingBar = ({
  totalSelectedCount,
  isSelectedAllItem,
  onClickSelectAllItem,
  onClickUnselectAllItem,
  onClickSuccessButton,
  countUnit = '권',
}) => (
  <Responsive css={styles.editingBarWrapper}>
    <div css={styles.editingBar}>
      <div css={styles.editingBarIconWrapper}>
        <Check css={styles.editingBarIcon} />
        <p css={styles.editingBarSelectCount}>
          {totalSelectedCount}
          {countUnit} 선택
        </p>
      </div>
      <div>
        {!isSelectedAllItem || totalSelectedCount === 0 ? (
          <button type="button" css={styles.editingBarAllSelect} onClick={onClickSelectAllItem}>
            전체 선택
          </button>
        ) : (
          <button type="button" css={styles.editingBarAllSelect} onClick={onClickUnselectAllItem}>
            선택 해제
          </button>
        )}
        <button type="button" css={styles.editingBarCompleteButton} onClick={onClickSuccessButton}>
          완료
        </button>
      </div>
    </div>
  </Responsive>
);

export default EditingBar;
