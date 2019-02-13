/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Icon } from '@ridi/rsg';
import { Editing } from '../Tool';
import FlexBar from '../FlexBar';
import UnitSortModal from '../Modal/UnitSortModal';
import { Align } from '../Modal/styles';
import * as styles from './styles';

class SeriesToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSortModalShow: false,
    };
  }

  render() {
    const { orderTitle, toggleEditingMode, currentOrder, orderOptions, href, as } = this.props;
    const { isSortModalShow } = this.state;

    return (
      <FlexBar
        css={styles.seriesToolBar}
        renderFlexLeft={() =>
          orderTitle ? (
            <div css={styles.buttonWrapper}>
              <button
                css={styles.orderButton}
                type="button"
                onClick={() => {
                  this.setState({
                    isSortModalShow: true,
                  });
                }}
              >
                {orderTitle}
                <Icon name="arrow_1_down" css={styles.arrow} />
              </button>
              {currentOrder !== undefined && orderOptions !== undefined && (
                <UnitSortModal
                  horizontalAlign={Align.Left}
                  order={currentOrder}
                  orderOptions={orderOptions}
                  isActive={isSortModalShow}
                  onClickModalBackground={() => {
                    this.setState({
                      isSortModalShow: false,
                    });
                  }}
                  href={href}
                  as={as}
                />
              )}
            </div>
          ) : null
        }
        renderFlexRight={() => <Editing toggleEditingMode={toggleEditingMode} />}
      />
    );
  }
}

export default SeriesToolBar;
