/** @jsx jsx */
import { jsx } from '@emotion/core';
import shortid from 'shortid';
import { Modal, ModalItemGroup, ModalLinkItem } from '../../../components/Modal';
import { URLMap } from '../../../constants/urls';

const FilterModal = props => {
  const { isActive, filter, filterOptions, query, onClickModalBackground } = props;

  return (
    <Modal isActive={isActive} a11y="카테고리 필터" onClickModalBackground={onClickModalBackground}>
      <ModalItemGroup groupTitle="모든 책 카테고리">
        <ul>
          {filterOptions.map(option => (
            <li key={shortid.generate()}>
              <ModalLinkItem
                title={option.title}
                showIcon={option.value === filter}
                icon="check_6"
                href={URLMap.main.href}
                as={URLMap.main.as}
                query={{
                  ...query,
                  filter: option.value,
                }}
              />
            </li>
          ))}
        </ul>
      </ModalItemGroup>
    </Modal>
  );
};

export default FilterModal;
