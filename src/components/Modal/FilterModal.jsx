import React from 'react';
import { Modal, ModalButtonItem, ModalItemCount, ModalItemGroup } from '.';
import { filterModalStyle as styles } from './styles';

const FilterItem = ({ option, filter, isChild, innerRef, onFilterChange }) => {
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

const FilterGroup = ({ groupTitle, filterOptions, filter, handleFilterChange, checkedItemEl }) => (
  <ModalItemGroup groupTitle={groupTitle}>
    <ul>
      {filterOptions.map(option => {
        const items = [];
        items.push(
          <FilterItem
            key={option.value}
            option={option}
            filter={filter}
            innerRef={option.value === filter ? checkedItemEl : undefined}
            onFilterChange={handleFilterChange}
          />,
        );

        if (option.children) {
          option.children.forEach(childOption => {
            items.push(
              <FilterItem
                key={childOption.value}
                option={childOption}
                filter={filter}
                isChild
                innerRef={childOption.value === filter ? checkedItemEl : undefined}
                onFilterChange={handleFilterChange}
              />,
            );
          });
        }

        return items;
      })}
    </ul>
  </ModalItemGroup>
);

const FilterModal = props => {
  const { filter, filterOptions, onFilterChange, onModalBackgroundClick } = props;
  const checkedItemEl = React.useRef(null);
  const modalEl = React.useRef(null);
  const { allCategoryOption, categoryOptions, serviceTypeOptions } = filterOptions;

  React.useLayoutEffect(() => {
    const modal = modalEl.current;
    const ModalTitleHeight = 32;
    const modalScrollTop = modal ? modal.getBoundingClientRect().top : 0;
    const checkedItemScrollTop = checkedItemEl.current ? checkedItemEl.current.getBoundingClientRect().top : ModalTitleHeight;
    modal.scrollTop = checkedItemScrollTop - modalScrollTop - ModalTitleHeight;
  }, []);

  return (
    <Modal modalRef={modalEl} isActive a11y="필터" onClickModalBackground={onModalBackgroundClick}>
      {allCategoryOption && (
        <FilterGroup
          filterOptions={[allCategoryOption]}
          filter={filter}
          handleFilterChange={onFilterChange}
          checkedItemEl={checkedItemEl}
        />
      )}
      {serviceTypeOptions && (
        <FilterGroup
          groupTitle="구매 방식 필터"
          filterOptions={serviceTypeOptions}
          filter={filter}
          handleFilterChange={onFilterChange}
          checkedItemEl={checkedItemEl}
        />
      )}
      {categoryOptions && (
        <FilterGroup
          groupTitle="카테고리 필터"
          filterOptions={categoryOptions}
          filter={filter}
          handleFilterChange={onFilterChange}
          checkedItemEl={checkedItemEl}
        />
      )}
    </Modal>
  );
};

export default FilterModal;
