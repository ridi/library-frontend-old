import React from 'react';

import IconButton from 'components/IconButton';
import MoreModal from 'components/Modal/MoreModal';
import ThreeDotsVertical from 'svgs/ThreeDotsVertical.svg';

import * as styles from './styles';

const More = ({ orderOptions, orderBy, orderDirection, query, showViewType, showOrder, showHidden }) => {
  const [modalVisiblity, setModalVisibility] = React.useState(false);
  return (
    <div css={styles.buttonWrapper}>
      <IconButton
        a11y="정렬"
        css={styles.iconButton(modalVisiblity)}
        onClick={() => {
          setModalVisibility(true);
        }}
      >
        <div css={styles.iconWrapper}>
          <ThreeDotsVertical css={styles.threeDotsIcon} />
        </div>
      </IconButton>
      {modalVisiblity && (
        <MoreModal
          orderOptions={orderOptions}
          orderBy={orderBy}
          orderDirection={orderDirection}
          query={query}
          isActive={modalVisiblity}
          onClickModalBackground={() => {
            setModalVisibility(false);
          }}
          showViewType={showViewType}
          showOrder={showOrder}
          showHidden={showHidden}
        />
      )}
    </div>
  );
};

export default More;
