/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withRouter } from 'react-router-dom';
import { Modal, ModalItemGroup, ModalLinkItem } from '.';

function buildTargetLocation(location, option, scroll) {
  const params = new URLSearchParams(location.search);
  const { orderBy, orderType } = option;
  orderType != null && params.set('order_type', orderType);
  orderBy != null && params.set('order_by', orderBy);
  const search = params.toString();

  return {
    ...location,
    search: search === '' ? '' : `?${search}`,
    state: {
      ...(location.state || {}),
      scroll,
    },
  };
}

const UnitSortModal = ({ order, orderOptions, scroll, isActive, location, onClickModalBackground, horizontalAlign }) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground} horizontalAlign={horizontalAlign}>
    <ModalItemGroup groupTitle="정렬 순서">
      <ul>
        {orderOptions.map(option => (
          <li key={option.key}>
            <ModalLinkItem
              scroll={false}
              title={option.title}
              isSelected={option.key === order}
              to={buildTargetLocation(location, option, scroll)}
              replace
            />
          </li>
        ))}
      </ul>
    </ModalItemGroup>
  </Modal>
);

export default withRouter(UnitSortModal);
