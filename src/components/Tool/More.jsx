/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ThreeDotsVertical from '../../svgs/ThreeDotsVertical.svg';
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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.order !== this.props.order) {
      this.setState({ isMoreModalShow: false });
    }
    return true;
  }

  render() {
    const { isMoreModalShow } = this.state;
    const { order, orderOptions, query, showViewType, showOrder, showHidden } = this.props;

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
            <ThreeDotsVertical css={styles.threeDotsIcon} />
          </div>
        </IconButton>
        {isMoreModalShow && (
          <MoreModal
            order={order}
            orderOptions={orderOptions}
            query={query}
            isActive={isMoreModalShow}
            onClickModalBackground={e => {
              e.preventDefault();
              e.stopPropagation();
              this.setState({
                isMoreModalShow: false,
              });
            }}
            showViewType={showViewType}
            showOrder={showOrder}
            showHidden={showHidden}
          />
        )}
      </div>
    );
  }
}
