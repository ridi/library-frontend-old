/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Modal, ModalItemGroup, ModalLinkItem } from '.';

const UnitSortModal = ({ order, orderOptions, isActive, href, as, query = {}, onClickModalBackground, horizontalAlign }) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground} horizontalAlign={horizontalAlign}>
    <ModalItemGroup groupTitle="정렬 순서">
      <ul>
        {orderOptions.map(option => (
          <li key={option.key}>
            <ModalLinkItem
              scroll={false}
              title={option.title}
              isSelected={option.key === order}
              href={href}
              as={as}
              query={{
                ...query,
                orderType: option.orderType,
                orderBy: option.orderBy,
              }}
              replace
            />
          </li>
        ))}
      </ul>
    </ModalItemGroup>
  </Modal>
);

export default UnitSortModal;
