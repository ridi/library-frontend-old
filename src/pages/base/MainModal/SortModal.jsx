import React from 'react';
import shortid from 'shortid';
import classnames from 'classnames';
import * as styles from './styles';

import { MenuGroup, MenuLinkItem } from '../../../components/Menu';
import { URLMap } from '../../../constants/urls';
import { MainOrderOptions } from '../../../constants/orderOptions';

const SortModal = props => {
  const { order, orderOptions, isActive, query } = props;

  return (
    <section className={classnames(styles.SortModal, isActive && styles.ModalActive)}>
      <MenuGroup title="정렬 순서">
        {orderOptions.map((option, index) => (
          <MenuLinkItem
            key={shortid.generate()}
            title={option.title}
            showIcon={index === order}
            icon="check_1"
            href={URLMap.main.href}
            as={URLMap.main.as}
            query={{
              ...query,
              ...MainOrderOptions.parse(index),
            }}
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
