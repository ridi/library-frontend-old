/** @jsx jsx */
import { jsx } from '@emotion/core';
import classname from 'classnames';
import Responsive from '../../pages/base/Responsive';
import * as styles from './styles';

const FlexBar = ({ hideTools, renderFlexLeft = () => null, renderFlexRight = () => null, className }) => (
  <Responsive className={classname([className, hideTools ? 'hideTools' : null])}>
    <div css={styles.flexWrapper}>
      {renderFlexLeft()}
      {renderFlexRight()}
    </div>
  </Responsive>
);

export default FlexBar;
