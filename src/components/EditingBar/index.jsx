import Responsive from 'pages/base/Responsive';
import Check from 'svgs/Check.svg';

import SelectAllButton from './SelectAllButton';
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
        <SelectAllButton
          isSelectedAll={isSelectedAllItem && totalSelectedCount !== 0}
          handleSelectAllClick={onClickSelectAllItem}
          handleDeselectAllClick={onClickUnselectAllItem}
        />
        <button type="button" css={styles.editingBarCompleteButton} onClick={onClickSuccessButton}>
          완료
        </button>
      </div>
    </div>
  </Responsive>
);

export default EditingBar;
