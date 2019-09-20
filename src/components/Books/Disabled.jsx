const disabled = {
  display: 'block',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: '300',
  overflow: 'hidden',
};
const dimmed = {
  display: 'block',
  position: 'absolute',
  left: 0,
  top: '-1px',
  width: '100%',
  height: '100%',
  background: '#f3f4f5',
  opacity: '0.4',
};

export const Disabled = () => (
  <div css={disabled}>
    <div css={dimmed} />
  </div>
);
