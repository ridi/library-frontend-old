/** @jsx jsx */
import { jsx } from '@emotion/core';
import Responsive from '../../pages/base/Responsive';
import Check from '../../svgs/Check.svg';
import * as styles from './styles';

const EditingBar = ({ totalSelectedCount, isSelectedAllBooks, onClickSelectAllBooks, onClickUnselectAllBooks, onClickSuccessButton }) => (
  <Responsive css={styles.editingBarWrapper}>
    <div css={styles.editingBar}>
      <div css={styles.editingBarIconWrapper}>
        <Check css={styles.editingBarIcon} />
        <p css={styles.editingBarSelectCount}>{totalSelectedCount}권 선택</p>
      </div>
      <div>
        {!isSelectedAllBooks || totalSelectedCount === 0 ? (
          <button type="button" css={styles.editingBarAllSelect} onClick={onClickSelectAllBooks}>
            전체 선택
          </button>
        ) : (
          <button type="button" css={styles.editingBarAllSelect} onClick={onClickUnselectAllBooks}>
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
