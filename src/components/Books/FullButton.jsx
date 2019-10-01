import { css } from '@emotion/core';

const fullButtonStyle = css`
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 350;
  a, button: {
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0;
    line-height: 0;
    color: transparent;
  }
`;

const FullButton = ({ children }) => <div css={fullButtonStyle}>{children}</div>;

export default FullButton;
