/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ThreeDots from '../../svgs/ThreeDots.svg';
import IconButton from '../IconButton';
import MoreModal from '../Modal/MoreModal';
import * as styles from './styles';

export default class More extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMoreModalShow: false,
    };
  }

  render() {
    const { isMoreModalShow } = this.state;
    const { order, orderOptions, query } = this.props;

    const onClickModalBackground = () => {
      this.setState({
        isMoreModalShow: false,
      });
    };

    return (
      <div css={styles.buttonWrapper}>
        <IconButton
          a11y="정렬"
          css={styles.iconButton(isMoreModalShow)}
          onClick={() => {
            this.setState({
              isMoreModalShow: true,
            });
          }}
        >
          <div css={styles.iconWrapper}>
            <ThreeDots css={styles.threeDotsIcon} />
          </div>
        </IconButton>
        {isMoreModalShow && (
          <MoreModal
            order={order}
            orderOptions={orderOptions}
            query={query}
            isActive={isMoreModalShow}
            onClickModalBackground={() => {
              onClickModalBackground();
            }}
          />
        )}
      </div>
    );
  }
}
