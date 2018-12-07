/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Icon } from '@ridi/rsg';
import Responsive from '../../pages/base/Responsive';

import * as styles from './styles';

const EditingBar = ({ totalSelectedCount, isSelectedAllBooks, onClickSelectAllBooks, onClickUnselectAllBooks, onClickSuccessButton }) => {
  return (
    <div css={styles.EditingBarWrapper}>
      <Responsive>
        <div css={styles.EditingBar}>
          <div css={styles.EditingBarIconWrapper}>
            <Icon name="check_1" css={styles.EditingBarIcon} />
            <div css={styles.EditingBarSelectCount}>{totalSelectedCount}권</div>
          </div>
          <div css={styles.EditingBarButtonWrapper}>
            {!isSelectedAllBooks || totalSelectedCount === 0 ? (
              <button type="button" css={styles.EditingBarAllSelect} onClick={onClickSelectAllBooks} disabled={totalSelectedCount === 0}>
                전체 선택
              </button>
            ) : (
              <button type="button" css={styles.EditingBarAllSelect} onClick={onClickUnselectAllBooks}>
                선택 해제
              </button>
            )}
            <button type="button" css={styles.EditingBarCompleteButton} onClick={onClickSuccessButton}>
              완료
            </button>
          </div>
        </div>
      </Responsive>
    </div>
  );
};

export default EditingBar;
