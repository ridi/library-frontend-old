/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { Modal, ModalButtonItem, ModalItemGroup, ModalLinkItem } from '.';
import { MainOrderOptions } from '../../constants/orderOptions';
import { URLMap } from '../../constants/urls';
import ViewType from '../../constants/viewType';
import { setViewType } from '../../services/viewType/actions';

const MoreModal = ({ order, orderOptions, isActive, query, onClickModalBackground, viewType, dispatchSetViewType }) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground}>
    <ModalItemGroup groupTitle="보기 방식">
      <ul>
        <li>
          <ModalButtonItem
            title="표지만 보기"
            isSelected={viewType === ViewType.PORTRAIT}
            onClick={() => {
              onClickModalBackground();
              dispatchSetViewType(ViewType.PORTRAIT);
            }}
          />
        </li>
        <li>
          <ModalButtonItem
            title="목록 보기"
            isSelected={viewType === ViewType.LANDSCAPE}
            onClick={() => {
              onClickModalBackground();
              dispatchSetViewType(ViewType.LANDSCAPE);
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
              isSelected={index === order}
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

const mapStateToProps = state => ({
  viewType: state.viewType,
});

const mapDispatchToProps = {
  dispatchSetViewType: setViewType,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoreModal);
