export const responsive = hasPadding => ({
  position: 'relative',
  width: '100%',
  maxWidth: 1000,
  margin: '0 auto',
  padding: hasPadding ? '0 16px' : '0',
  boxSizing: 'border-box',
});
