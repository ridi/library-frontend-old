/** @jsx jsx */
import { jsx } from '@emotion/core';
import IconButton from '../IconButton';
import * as styles from './styles';

import CategoryFilter from '../../svgs/CategoryFilter.svg';
import Edit from '../../svgs/Edit.svg';
import ThreeDots from '../../svgs/ThreeDots.svg';

const Tool = ({ filter, toggleFilterModal, edit, toggleEditingMode, more, toggleMoreModal }) => (
  <>
    {filter && (
      <IconButton a11y="필터" css={styles.iconButton} onClick={toggleFilterModal}>
        <CategoryFilter css={styles.categoryFilterIcon} />
      </IconButton>
    )}
    {edit && (
      <IconButton a11y="편집" css={styles.iconButton} onClick={toggleEditingMode}>
        <Edit css={styles.editIcon} />
      </IconButton>
    )}
    {more && (
      <IconButton a11y="정렬" css={styles.iconButton} onClick={toggleMoreModal}>
        <ThreeDots css={styles.threeDotsIcon} />
      </IconButton>
    )}
  </>
);

export default Tool;
