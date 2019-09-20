import classname from 'classnames';
import Responsive from '../../pages/base/Responsive';
import * as styles from './styles';

const FlexBar = ({ hideTools, flexLeft = null, flexRight = null, className }) => (
  <Responsive className={classname([className, hideTools ? 'hideTools' : null])}>
    <div css={styles.flexWrapper}>
      {flexLeft}
      {flexRight}
    </div>
  </Responsive>
);

export default FlexBar;
