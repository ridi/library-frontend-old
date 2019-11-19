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

  shouldComponentUpdate(nextProps) {
    const { currentOrder } = this.props;
    if (nextProps.currentOrder !== currentOrder) {
      this.setState({ isSortModalShow: false });
    }
    return true;
  }

  renderOrder() {
    const { currentOrder, orderOptions, scroll } = this.props;
    const { isSortModalShow } = this.state;

    if (!currentOrder || !orderOptions) {
      return <div css={styles.buttonWrapper} />;
    }

    return (
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
          {orderOptions.find(option => option.key === currentOrder).title}
          <ArrowTriangleDown css={styles.arrow} />
        </button>
        <UnitSortModal
          horizontalAlign={Align.Left}
          order={currentOrder}
          orderOptions={orderOptions}
          scroll={scroll}
          isActive={isSortModalShow}
          onClickModalBackground={() => {
            this.setState({
              isSortModalShow: false,
            });
          }}
        />
      </div>
    );
  }

  render() {
    const { toggleEditingMode } = this.props;

    return (
      <FlexBar css={styles.seriesToolBar} flexLeft={this.renderOrder()} flexRight={<Editing toggleEditingMode={toggleEditingMode} />} />
    );
  }
}

export default SeriesToolBar;
