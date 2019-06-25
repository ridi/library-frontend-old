/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ThreeDotsVertical from '../../svgs/ThreeDotsVertical.svg';
import IconButton from '../IconButton';
import ShelfOrderModal from '../Modal/ShelfOrderModal';
import * as styles from './styles';

export default class ShelfOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShelfOrderModalShow: false,
    };
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.order !== this.props.order) {
      this.setState({ isShelfOrderModalShow: false });
    }
    return true;
  }

  render() {
    const { isShelfOrderModalShow } = this.state;
    const { order, orderOptions, onClickOrderOption } = this.props;

    return (
      <div css={styles.buttonWrapper}>
        <IconButton
          a11y="책장 정렬"
          css={styles.iconButton(isShelfOrderModalShow)}
          onClick={() => {
            this.setState({
              isShelfOrderModalShow: true,
            });
          }}
        >
          <div css={styles.iconWrapper}>
            <ThreeDotsVertical css={styles.threeDotsIcon} />
          </div>
        </IconButton>
        {isShelfOrderModalShow && (
          <ShelfOrderModal
            order={order}
            orderOptions={orderOptions}
            isActive={isShelfOrderModalShow}
            onClickModalBackground={() => {
              this.setState({
                isShelfOrderModalShow: false,
              });
            }}
            onClickOrderOption={onClickOrderOption}
          />
        )}
      </div>
    );
  }
}
