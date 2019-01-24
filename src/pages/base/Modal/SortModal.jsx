/** @jsx jsx */
import { jsx } from '@emotion/core';
import shortid from 'shortid';

import { Modal, ModalItemGroup, ModalButtonItem, ModalLinkItem } from '../../../components/Modal';
import { URLMap } from '../../../constants/urls';
import ViewType from '../../../constants/viewType';
import { MainOrderOptions } from '../../../constants/orderOptions';

const SortModal = ({ order, orderOptions, isActive, query, onClickModalBackground, viewType, onClickViewType }) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground}>
    <ModalItemGroup groupTitle="보기 방식">
      <ul>
        <li>
          <ModalButtonItem
            title="표지만 보기"
            icon="check_6"
            showIcon={viewType === ViewType.PORTRAIT}
            onClick={() => {
              onClickViewType(ViewType.PORTRAIT);
            }}
          />
        </li>
        <li>
          <ModalButtonItem
            title="목록 보기"
            icon="check_6"
            showIcon={viewType === ViewType.LANDSCAPE}
            onClick={() => {
              onClickViewType(ViewType.LANDSCAPE);
            }}
          />
        </li>
      </ul>
    </ModalItemGroup>
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

export default SortModal;
