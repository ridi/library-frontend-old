/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Icon } from '@ridi/rsg';
import Tool from '../Tool';
import FlexBar from '../FlexBar';
import * as styles from './styles';

const SeriesToolBar = ({ orderTitle, toggleSortModal, toggleEditingMode }) => (
  <FlexBar
    css={styles.seriesToolBar}
    renderFlexLeft={() => (
      <div>
        {orderTitle ? (
          <button css={styles.orderButton} type="button" onClick={toggleSortModal}>
            {orderTitle}
            <Icon name="arrow_1_down" css={styles.arrow} />
          </button>
        ) : null}
      </div>
    )}
    renderFlexRight={() => <Tool edit toggleEditingMode={toggleEditingMode} />}
  />
);

export default SeriesToolBar;
