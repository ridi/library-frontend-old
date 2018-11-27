import React from 'react';
import classnames from 'classnames';
import * as styles from './styles';

import { MenuGroup, MenuItem } from '../../../components/Menu';

const FilterModal = props => {
  const { isActive, filter, filterOptions, onClick } = props;

  return (
    <section className={classnames(styles.FilterModal, isActive && styles.ModalActive)}>
      <MenuGroup title="모든 책 카테고리">
        {filterOptions.map(option => (
          <MenuItem title={option.title} showIcon={option.value === filter} icon="check_1" onClick={() => onClick(option.value)} />
        ))}
      </MenuGroup>
    </section>
  );
};

export default FilterModal;
