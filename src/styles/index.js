import { css, injectGlobal } from 'emotion';
import { globalReset } from './reset';

injectGlobal(globalReset);

export const hidden = css({
  fontSize: 0,
  width: 0,
  height: 0,
  color: 'transparent',
  overflow: 'none',
});
