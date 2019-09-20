const fullButtonStyle = {
  display: 'block',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: '350',
  'a, button': {
    display: 'block',
    width: '100%',
    height: '100%',
    fontSize: 0,
    lineHeight: 0,
    color: 'transparent',
  },
};

const FullButton = ({ children }) => <div css={fullButtonStyle}>{children}</div>;

export default FullButton;
