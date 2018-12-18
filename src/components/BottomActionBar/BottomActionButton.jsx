/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const styles = {
  bottomActionButton: css({
    fontSize: 15,
    lineHeight: 1.2,
    letterCpacing: 0,
    textAlign: 'center',
    color: '#1f8ce6',

    height: 50,
  }),
  bottomActionButtonDisable: css({
    opacity: 0.4,
  }),
};

const BottomActionButton = ({ name, onClick, disable, className = null }) => (
  <button
    type="button"
    css={[styles.bottomActionButton, disable && styles.bottomActionButtonDisable]}
    className={className}
    onClick={onClick}
    disabled={disable}
  >
    {name}
  </button>
);

export default BottomActionButton;
