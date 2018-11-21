import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as styles from './styles';

import { MenuGroup, MenuItem } from '../../../components/Menu';

import { MainOrderOptions } from '../../../constants/orderOptions';
import { changePurchaseOrder } from '../../../services/purchased/main/actions';
import { getPageInfo } from '../../../services/purchased/main/selectors';

const SortModal = props => {
  const {
    pageInfo: { order },
    changePurchaseOrder: dispatchChangePurchaseOrder,
    isActive,
  } = props;

  return (
    <section className={classnames(styles.SortModal, isActive && styles.ModalActive)}>
      <MenuGroup title="정렬순서">
        {MainOrderOptions.toList().map((option, index) => (
          <MenuItem title={option.title} showIcon={index === order} icon="check_1" onClick={() => dispatchChangePurchaseOrder(index)} />
        ))}
      </MenuGroup>
    </section>
  );
};

const mapStateToProps = state => ({
  pageInfo: getPageInfo(state),
});
const mapDispatchToProps = {
  changePurchaseOrder,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SortModal);
