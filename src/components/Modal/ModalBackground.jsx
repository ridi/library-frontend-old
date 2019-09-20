import * as styles from './styles';

export const ModalBackground = ({ isActive, onClickModalBackground }) => (
  <div css={styles.modalBackground(isActive)}>
    <div css={styles.transparentCloseButtonContainer}>
      <button type="button" css={styles.transparentCloseButton} onClick={onClickModalBackground} />
    </div>
  </div>
);
