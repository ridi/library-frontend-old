/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ArrowTriangleDown from '../../svgs/ArrowTriangleDown.svg';
import FlexBar from '../FlexBar';
import { Align } from '../Modal/styles';
import UnitSortModal from '../Modal/UnitSortModal';
import { Editing } from '../Tool';
import * as styles from './styles';

class SeriesToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSortModalShow: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentOrder !== this.props.currentOrder) {
      this.setState({ isSortModalShow: false });
    }
    return true;
  }

  render() {
    const { toggleEditingMode, currentOrder, orderOptions, href, as } = this.props;
    const { isSortModalShow } = this.state;

    const orderTitle = orderOptions.find(option => option.key === currentOrder).title;
    return (
      <FlexBar
        css={styles.seriesToolBar}
        flexLeft={
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
              <ArrowTriangleDown css={styles.arrow} />
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
        }
        flexRight={<Editing toggleEditingMode={toggleEditingMode} />}
      />
    );
  }
}

export default SeriesToolBar;
