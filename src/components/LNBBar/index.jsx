/** @jsx jsx */
import { jsx } from '@emotion/core';
import Responsive from '../../pages/base/Responsive';
import * as styles from './styles';

const LNBBar = ({ hideTools, renderFlexLeft, renderFlexRight }) => (
  <Responsive className={hideTools ? 'hideTools' : ''} css={styles.LNBBar}>
    <div css={styles.flexWrapper}>
      {renderFlexLeft()}
      {renderFlexRight()}
    </div>
  </Responsive>
);

export default LNBBar;
