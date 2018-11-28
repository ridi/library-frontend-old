import React from 'react';
import shortid from 'shortid';
import classnames from 'classnames';
import * as styles from './styles';

import { MenuGroup, MenuItem } from '../../../components/Menu';

const SortModal = props => {
  const { order, orderOptions, isActive, onClick } = props;

  return (
    <section className={classnames(styles.SortModal, isActive && styles.ModalActive)}>
      <MenuGroup title="정렬순서">
        {orderOptions.map((option, index) => (
          <MenuItem
            key={shortid.generate()}
            title={option.title}
            showIcon={index === order}
            icon="check_1"
            onClick={() => onClick(index)}
          />
        ))}
      </MenuGroup>
    </section>
  );
};

export default SortModal;
