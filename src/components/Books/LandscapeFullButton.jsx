/** @jsx jsx */
import { jsx } from '@emotion/core';

const landscapeFullButtonStyle = {
  display: 'block',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  'a, button': {
    display: 'block',
    width: '100%',
    height: '100%',
    fontSize: 0,
    lineHeight: 0,
    color: 'transparent',
  },
};

const LandscapeFullButton = ({ thumbnailLink }) => <div css={landscapeFullButtonStyle}>{thumbnailLink}</div>;

export default LandscapeFullButton;
