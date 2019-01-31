/** @jsx jsx */
import { jsx } from '@emotion/core';
import shortid from 'shortid';
import { Modal, ModalItemGroup, ModalLinkItem } from '.';
import { URLMap } from '../../constants/urls';
import { filterModalStyle as styles } from './styles';

const makeModalLinkItem = (option, filter, query, isChild) => (
  <li key={shortid.generate()}>
    <ModalLinkItem
      count={option.count}
      isSelected={option.value === filter}
      href={URLMap.main.href}
      as={URLMap.main.as}
      query={{
        ...query,
        filter: option.value,
      }}
    >
      {isChild ? (
        <span css={styles.childPathWrapper}>
          <span css={styles.childPathIcon} />
          {option.title}
        </span>
      ) : (
        option.title
      )}
    </ModalLinkItem>
  </li>
);

const FilterModal = props => {
  const { isActive, filter, filterOptions, query, onClickModalBackground } = props;

  return (
    <Modal isActive={isActive} a11y="카테고리 필터" onClickModalBackground={onClickModalBackground}>
      <ModalItemGroup groupTitle="모든 책 카테고리">
        <ul>
          {filterOptions.map(option => {
            const items = [];
            items.push(makeModalLinkItem(option, filter, query, false));

            if (option.children) {
              option.children.map(childOption => items.push(makeModalLinkItem(childOption, filter, query, true)));
            }

            return items;
          })}
        </ul>
      </ModalItemGroup>
    </Modal>
  );
};

export default FilterModal;
