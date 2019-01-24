/** @jsx jsx */
import { jsx } from '@emotion/core';
import shortid from 'shortid';

import { Modal, ModalItemGroup, ModalLinkItem } from '../../../components/Modal';

const UnitSortModal = ({ order, orderOptions, isActive, href, as, query = {}, onClickModalBackground }) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground}>
    <ModalItemGroup groupTitle="정렬 순서">
      <ul>
        {orderOptions.map((option, index) => (
          <li key={shortid.generate()}>
            <ModalLinkItem
              title={option.title}
              showIcon={index === order}
              icon="check_6"
              href={href}
              as={as}
              query={{
                ...query,
                orderType: option.orderType,
                orderBy: option.orderBy,
              }}
            />
          </li>
        ))}
      </ul>
    </ModalItemGroup>
  </Modal>
);

export default UnitSortModal;
