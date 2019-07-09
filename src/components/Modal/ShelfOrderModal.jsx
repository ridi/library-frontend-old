/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Modal, ModalButtonItem, ModalItemGroup } from '.';

const ShelfOrderModal = ({ order, orderOptions, isActive, onClickModalBackground, onClickOrderOption }) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground}>
    <ModalItemGroup groupTitle="책장 정렬 순서">
      <ul>
        {orderOptions.map(option => (
          <li key={option.key}>
            <ModalButtonItem
              title={option.title}
              isSelected={option.key === order}
              onClick={() => {
                onClickOrderOption(option);
              }}
            />
          </li>
        ))}
      </ul>
    </ModalItemGroup>
  </Modal>
);

export default ShelfOrderModal;
