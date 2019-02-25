/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import CategoryFilter from '../../svgs/CategoryFilter.svg';
import On from '../../svgs/On.svg';
import IconButton from '../IconButton';
import FilterModal from '../Modal/FilterModal';
import * as styles from './styles';

export default class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFilterModalShow: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.filter !== this.props.filter) {
      this.setState({ isFilterModalShow: false });
    }
    return true;
  }

  render() {
    const { filter, filterOptions, query } = this.props;
    const { isFilterModalShow } = this.state;

    return (
      <div css={styles.buttonWrapper}>
        <IconButton
          a11y="필터"
          css={styles.iconButton(isFilterModalShow)}
          onClick={() => {
            this.setState({
              isFilterModalShow: true,
            });
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
        {isFilterModalShow && (
          <FilterModal
            filter={filter}
            filterOptions={filterOptions}
            query={query}
            isActive={isFilterModalShow}
            onClickModalBackground={e => {
              e.preventDefault();
              e.stopPropagation();
              this.setState({
                isFilterModalShow: false,
              });
            }}
          />
        )}
      </div>
    );
  }
}
