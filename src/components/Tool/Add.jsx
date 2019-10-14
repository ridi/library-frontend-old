import PlusIcon from '../../svgs/Plus.svg';
import IconButton from '../IconButton';
import * as styles from './styles';

export const Add = props => {
  const { onClickAddButton, children } = props;
  return (
    <div css={styles.buttonWrapper}>
      <IconButton a11y="추가" css={styles.iconButton()} onClick={onClickAddButton}>
        <div css={styles.iconWrapper}>
          <PlusIcon />
        </div>
      </IconButton>
      {children}
    </div>
  );
};
