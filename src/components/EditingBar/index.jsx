/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Icon } from '@ridi/rsg';
import Responsive from '../../pages/base/Responsive';

import * as styles from './styles';

const EditingBar = ({ totalSelectedCount, isSelectedAllBooks, onClickSelectAllBooks, onClickUnselectAllBooks, onClickSuccessButton }) => (
  <div css={styles.editingBarWrapper}>
    <Responsive>
      <div css={styles.editingBar}>
        <div css={styles.editingBarIconWrapper}>
          <Icon name="check_1" css={styles.editingBarIcon} />
          <div css={styles.editingBarSelectCount}>{totalSelectedCount}권</div>
        </div>
        <div css={styles.editingBarButtonWrapper}>
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
  </div>
);

export default EditingBar;
