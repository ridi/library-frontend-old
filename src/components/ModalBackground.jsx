/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const styles = {
  modalBackgroundWrapper: css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',

    pointerEvents: 'none',
    zIndex: -9999,
  }),
  modalBackgroundWrapperActive: css({
    pointerEvents: 'initial',
    zIndex: 9000,
  }),
  modalContainer: css({
    position: 'relative',
    width: '100%',
    height: '100%',
  }),
  modalBackground: css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  }),
};

const ModalBackground = ({ isActive, onClickModalBackground }) => (
  <div css={[styles.modalBackgroundWrapper, isActive && styles.modalBackgroundWrapperActive]}>
    <div css={styles.modalContainer}>
      <button type="button" css={styles.modalBackground} onClick={onClickModalBackground} />
    </div>
  </div>
);

export default ModalBackground;
