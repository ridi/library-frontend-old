import React from 'react';
import { Modal, ModalButtonItem, ModalItemCount, ModalItemGroup } from '.';
import { filterModalStyle as styles } from './styles';

const CategoryItem = ({ option, filter, isChild, innerRef, onFilterChange }) => {
  const handleClick = React.useCallback(() => onFilterChange(option.value), [option.value, onFilterChange]);
  return (
    <li ref={innerRef}>
      <ModalButtonItem isSelected={option.value === filter} onClick={handleClick}>
        {isChild ? (
          <span css={styles.childPathWrapper}>
            <span css={styles.childPathIcon} />
            {option.title}
          </span>
        ) : (
          option.title
        )}
        <ModalItemCount>{option.count}</ModalItemCount>
      </ModalButtonItem>
    </li>
  );
};

const FilterModal = props => {
  const { filter, filterOptions, onFilterChange, onModalBackgroundClick } = props;
  const checkedItemEl = React.useRef(null);
  const modalEl = React.useRef(null);

  React.useLayoutEffect(() => {
    const modal = modalEl.current;
    const ModalTitleHeight = 32;
    const modalScrollTop = modal ? modal.getBoundingClientRect().top : 0;
    const checkedItemScrollTop = checkedItemEl.current ? checkedItemEl.current.getBoundingClientRect().top : ModalTitleHeight;
    modal.scrollTop = checkedItemScrollTop - modalScrollTop - ModalTitleHeight;
  }, []);

  return (
    <Modal modalRef={modalEl} isActive a11y="카테고리 필터" onClickModalBackground={onModalBackgroundClick}>
      <ModalItemGroup groupTitle="모든 책 카테고리">
        <ul>
          {filterOptions.map(option => {
            const items = [];
            items.push(
              <CategoryItem
                key={option.value}
                option={option}
                filter={filter}
                innerRef={option.value === filter ? checkedItemEl : undefined}
                onFilterChange={onFilterChange}
              />,
            );

            if (option.children) {
              option.children.forEach(childOption => {
                items.push(
                  <CategoryItem
                    key={childOption.value}
                    option={childOption}
                    filter={filter}
                    isChild
                    innerRef={childOption.value === filter ? checkedItemEl : undefined}
                    onFilterChange={onFilterChange}
                  />,
                );
              });
            }

            return items;
          })}
        </ul>
      </ModalItemGroup>
    </Modal>
  );
};

export default FilterModal;
