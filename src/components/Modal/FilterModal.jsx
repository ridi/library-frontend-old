import { useLayoutEffect, useRef } from 'react';
import { Modal, ModalItemCount, ModalItemGroup, ModalLinkItem } from '.';
import { URLMap } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import { filterModalStyle as styles } from './styles';

const makeModalLinkItem = (option, filter, query, isChild, checkedItemRef) => {
  const { to } = makeLinkProps({}, URLMap.main.as, { ...query, filter: option.value });
  return (
    <li key={`${JSON.stringify(option)}-${isChild}`} ref={option.value === filter ? checkedItemRef : null}>
      <ModalLinkItem isSelected={option.value === filter} to={to}>
        {isChild ? (
          <span css={styles.childPathWrapper}>
            <span css={styles.childPathIcon} />
            {option.title}
          </span>
        ) : (
          option.title
        )}
        <ModalItemCount>{option.count}</ModalItemCount>
      </ModalLinkItem>
    </li>
  );
};

const FilterModal = props => {
  const { isActive, filter, filterOptions, query, onClickModalBackground } = props;
  const checkedItemEl = useRef(null);
  const modalEl = useRef(null);

  useLayoutEffect(() => {
    const modal = modalEl.current;
    const ModalTitleHeight = 32;
    const modalScrollTop = modal ? modal.getBoundingClientRect().top : 0;
    const checkedItemScrollTop = checkedItemEl.current ? checkedItemEl.current.getBoundingClientRect().top : ModalTitleHeight;
    modal.scrollTop = checkedItemScrollTop - modalScrollTop - ModalTitleHeight;
  }, [isActive]);

  return (
    <Modal modalRef={modalEl} isActive={isActive} a11y="카테고리 필터" onClickModalBackground={onClickModalBackground}>
      <ModalItemGroup groupTitle="모든 책 카테고리">
        <ul>
          {filterOptions.map(option => {
            const items = [];
            items.push(makeModalLinkItem(option, filter, query, false, checkedItemEl));

            if (option.children) {
              option.children.map(childOption => items.push(makeModalLinkItem(childOption, filter, query, true, checkedItemEl)));
            }

            return items;
          })}
        </ul>
      </ModalItemGroup>
    </Modal>
  );
};

export default FilterModal;
