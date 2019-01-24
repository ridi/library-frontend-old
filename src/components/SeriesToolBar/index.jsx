/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Tool from '../Tool';
import FlexBar from '../FlexBar';

const styles = {
  orderButton: css({
    fontSize: 14,
    letterSpacing: -0.3,
    color: '#40474d',
  }),
};

const SeriesToolBar = ({ orderTitle, toggleSortModal, toggleEditingMode }) => (
  <FlexBar
    renderFlexLeft={() => (
      <div>
        <button css={styles.orderButton} type="button" onClick={toggleSortModal}>
          {orderTitle}
        </button>
      </div>
    )}
    renderFlexRight={() => <Tool edit toggleEditingMode={toggleEditingMode} />}
  />
);

export default SeriesToolBar;
