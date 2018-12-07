/** @jsx jsx */
import { jsx } from '@emotion/core';
import shortid from 'shortid';
import * as styles from './styles';

import { MenuGroup, MenuLinkItem } from '../../../components/Menu';
import { URLMap } from '../../../constants/urls';

const FilterModal = props => {
  const { isActive, filter, filterOptions, query } = props;

  return (
    <section css={[styles.FilterModal, isActive && styles.ModalActive]}>
      <MenuGroup title="모든 책 카테고리">
        {filterOptions.map(option => (
          <MenuLinkItem
            key={shortid.generate()}
            title={option.title}
            showIcon={option.value === filter}
            icon="check_1"
            href={URLMap.main.href}
            as={URLMap.main.as}
            query={{
              ...query,
              filter: option.value,
            }}
          />
        ))}
      </MenuGroup>
    </section>
  );
};

export default FilterModal;
