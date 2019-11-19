import { withRouter } from 'react-router-dom';

import { Modal, ModalItemGroup, ModalLinkItem } from '.';

function buildTargetLocation(location, option, scroll) {
  const params = new URLSearchParams(location.search);
  const { orderBy, orderType } = option;
  orderType != null && params.set('order_type', orderType);
  orderBy != null && params.set('order_by', orderBy);
  const search = params.toString();

  const calculatedScroll = typeof scroll === 'function' ? scroll() : scroll;
  return {
    ...location,
    search: search === '' ? '' : `?${search}`,
    state: {
      ...(location.state || {}),
      scroll: calculatedScroll,
    },
  };
}

const UnitSortModal = ({ order, orderOptions, scroll, isActive, location, onClickModalBackground, horizontalAlign }) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground} horizontalAlign={horizontalAlign}>
    <ModalItemGroup groupTitle="정렬 순서">
      <ul>
        {orderOptions.map(option => (
          <li key={option.key}>
            <ModalLinkItem isSelected={option.key === order} to={buildTargetLocation(location, option, scroll)} replace>
              {option.title}
            </ModalLinkItem>
          </li>
        ))}
      </ul>
    </ModalItemGroup>
  </Modal>
);

export default withRouter(UnitSortModal);
