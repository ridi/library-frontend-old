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

  shouldComponentUpdate(nextProps) {
    const { order } = this.props;
    if (nextProps.order !== order) {
      this.setState({ isMoreModalShow: false });
    }
    return true;
  }

  render() {
    const { isMoreModalShow } = this.state;
    const { orderOptions, orderBy, orderDirection, query, showViewType, showOrder, showHidden } = this.props;

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
            orderOptions={orderOptions}
            orderBy={orderBy}
            orderDirection={orderDirection}
            query={query}
            isActive={isMoreModalShow}
            onClickModalBackground={() => {
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
