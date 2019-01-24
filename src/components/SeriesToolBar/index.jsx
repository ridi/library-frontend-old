/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Icon } from '@ridi/rsg';
import React from 'react';
import Tool from '../Tool';
import FlexBar from '../FlexBar';

const styles = {
  orderButton: css({
    fontSize: 14,
    letterSpacing: -0.3,
    color: '#40474d',
  }),
  arrow: css({
    marginLeft: 5,
    width: 7,
    height: 7,
  }),
};

const SeriesToolBar = ({ orderTitle, toggleSortModal, toggleEditingMode }) => (
  <FlexBar
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
