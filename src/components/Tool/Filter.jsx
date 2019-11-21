import React from 'react';

import CategoryFilter from '../../svgs/CategoryFilter.svg';
import On from '../../svgs/On.svg';
import IconButton from '../IconButton';
import FilterModal from '../Modal/FilterModal';
import * as styles from './styles';

export default function Filter({ filter, filterOptions, onFilterChange }) {
  const [isFilterModalOpen, setFilterModalOpen] = React.useState(false);

  React.useEffect(() => {
    setFilterModalOpen(false);
  }, [filter]);

  return (
    <div css={styles.buttonWrapper}>
      <IconButton
        a11y="필터"
        css={styles.iconButton(isFilterModalOpen)}
        onClick={() => {
          setFilterModalOpen(true);
        }}
      >
        <div css={styles.iconWrapper}>
          <CategoryFilter css={styles.categoryFilterIcon} />
        </div>
        {filter && (
          <div css={[styles.iconWrapper, { paddingRight: 2 }]}>
            <On css={styles.onIcon} />
          </div>
        )}
      </IconButton>
      {isFilterModalOpen && (
        <FilterModal
          filter={filter}
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
          onModalBackgroundClick={() => {
            setFilterModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
