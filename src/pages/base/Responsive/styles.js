import { maxWidthWrapper } from '../../../styles';

export const responsive = hasPadding => ({
  position: 'relative',
  width: '100%',
  padding: hasPadding ? '0 16px' : '0',
  margin: '0 auto',
  boxSizing: 'border-box',
  ...maxWidthWrapper,
});
