/** @jsx jsx */
import { jsx } from '@emotion/core';
import Responsive from '../../pages/base/Responsive';
import * as styles from './styles';

const FlexBar = ({ hideTools, renderFlexLeft = () => null, renderFlexRight = () => null }) => (
  <Responsive className={hideTools ? 'hideTools' : ''} css={styles.flexBar}>
    <div css={styles.flexWrapper}>
      {renderFlexLeft()}
      {renderFlexRight()}
    </div>
  </Responsive>
);

export default FlexBar;
