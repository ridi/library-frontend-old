import { ButtonType } from './constants';
import * as styles from './styles';

export const ActionButton = ({ name, onClick, type = ButtonType.NORMAL, disable = false, className = '' }) =>
  type === ButtonType.SPACER ? (
    <div css={styles.actionButtonType(ButtonType.SPACER)} />
  ) : (
    <button
      type="button"
      css={[styles.actionButton(disable), styles.actionButtonType(type)]}
      className={className}
      onClick={onClick}
      disabled={disable}
    >
      {name}
    </button>
  );
