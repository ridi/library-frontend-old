import React from 'react';
import shortid from 'shortid';
import classnames from 'classnames';
import * as styles from './styles';

import { MenuGroup, MenuItem, MenuLinkItem } from '../../../components/Menu';
import { URLMap } from '../../../constants/urls';

const SortModal = props => {
  const { order, orderOptions, isActive, onClick } = props;

  return (
    <section className={classnames(styles.SortModal, isActive && styles.ModalActive)}>
      <MenuGroup title="정렬 순서">
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

      <MenuGroup title="숨김 메뉴">
        <MenuLinkItem key={shortid.generate()} title="숨김 도서 목록" href={URLMap.hidden.href} as={URLMap.hidden.as} />
      </MenuGroup>
    </section>
  );
};

export default SortModal;
