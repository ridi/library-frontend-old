import React from 'react';
import { connect } from 'react-redux';
import { Icon } from '@ridi/rsg';
import Responsive from '../../pages/base/Responsive';

import * as styles from './styles';

const EditingBar = ({ totalSelectedCount, onClickSuccessButton }) => (
  <div className={styles.EditingBarWrapper}>
    <Responsive>
      <div className={styles.EditingBar}>
        <div className={styles.EditingBarIconWrapper}>
          <Icon name="check_1" className={styles.EditingBarIcon} />
          <div className={styles.EditingBarSelectCount}>{totalSelectedCount}권</div>
        </div>
        <div className={styles.EditingBarButtonWrapper}>
          <button type="button" className={styles.EditingBarAllSelect}>
            전체 선택
          </button>
          <button type="button" className={styles.EditingBarCompleteButton} onClick={onClickSuccessButton}>
            완료
          </button>
        </div>
      </div>
    </Responsive>
  </div>
);

export default EditingBar;
