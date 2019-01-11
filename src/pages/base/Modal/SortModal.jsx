/** @jsx jsx */
import { jsx } from '@emotion/core';
import shortid from 'shortid';

import { Modal, ModalItemGroup, ModalLinkItem } from '../../../components/Modal';
import { URLMap } from '../../../constants/urls';
import { MainOrderOptions } from '../../../constants/orderOptions';

const SortModal = props => {
  const { order, orderOptions, isActive, query } = props;

  return (
    <Modal isActive={isActive} a11y="옵션">
      <ModalItemGroup groupTitle="정렬 순서">
        <ul>
          {orderOptions.map((option, index) => (
            <li key={shortid.generate()}>
              <ModalLinkItem
                title={option.title}
                showIcon={index === order}
                icon="check_6"
                href={URLMap.main.href}
                as={URLMap.main.as}
                query={{
                  ...query,
                  ...MainOrderOptions.parse(index),
                }}
              />
            </li>
          ))}
        </ul>
      </ModalItemGroup>
      <ModalItemGroup groupTitle="숨김 메뉴">
        <ModalLinkItem title="숨김 도서 목록" href={URLMap.hidden.href} as={URLMap.hidden.as} />
      </ModalItemGroup>
    </Modal>
  );
};

export default SortModal;
