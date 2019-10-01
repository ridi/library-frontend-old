import * as styles from './styles';

export const TooltipBackground = ({ isActive, onClickTooltipBackground }) => (
  <div css={styles.tooltipBackground(isActive)}>
    <div css={styles.transparentCloseButtonContainer}>
      <button type="button" css={styles.transparentCloseButton} onClick={onClickTooltipBackground} />
    </div>
  </div>
);
