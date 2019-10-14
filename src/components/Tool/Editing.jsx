import React from 'react';
import Edit from '../../svgs/Edit.svg';
import IconButton from '../IconButton';
import * as styles from './styles';

const Editing = props => {
  const { toggleEditingMode } = props;

  return (
    <div css={styles.buttonWrapper}>
      <IconButton a11y="편집" css={styles.iconButton()} onClick={toggleEditingMode}>
        <div css={styles.iconWrapper}>
          <Edit css={styles.editIcon} />
        </div>
      </IconButton>
    </div>
  );
};

export default Editing;
