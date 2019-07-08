/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Modal, ModalButtonItem, ModalItemGroup, ModalLinkItem } from '.';
import { URLMap } from '../../constants/urls';

const ShelfOrderModal = ({ order, orderOptions, isActive, onClickModalBackground, onClickOrderOption }) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground}>
    <ModalItemGroup groupTitle="책장 정렬 순서">
      <ul>
        {orderOptions.map(option => (
          <li key={option.key}>
            {onClickOrderOption ? (
              <ModalButtonItem
                title={option.title}
                isSelected={option.key === order}
                onClick={() => {
                  onClickOrderOption(option);
                }}
              />
            ) : (
              <ModalLinkItem
                title={option.title}
                isSelected={option.key === order}
                as={URLMap.shelves.as}
                query={{
                  orderBy: option.orderType,
                  orderDirection: option.orderBy,
                  page: 1,
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </ModalItemGroup>
  </Modal>
);

export default ShelfOrderModal;
