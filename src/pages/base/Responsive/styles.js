import { maxWidthWrapper } from '../../../styles';

export const responsive = (hasPadding, minHeight) => ({
  position: 'relative',
  width: '100%',
  padding: hasPadding ? '0 16px' : '0',
  minHeight: minHeight ? 220 : 'auto',
  margin: '0 auto',
  boxSizing: 'border-box',
  ...maxWidthWrapper,
});
