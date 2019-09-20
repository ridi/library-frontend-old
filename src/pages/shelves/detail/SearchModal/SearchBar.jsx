import { css } from '@emotion/core';
import FlexBar from '../../../../components/FlexBar';
import SearchBox from '../../../../components/SearchBox';

const searchBarStyles = {
  bar: css`
    border-bottom: 1px solid #d1d5d9;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
    background-color: #f3f4f5;
  `,
};

export default function SearchBar({ keyword, onClear, onConfirm, onKeywordChange }) {
  const left = <SearchBox keyword={keyword} onClear={onClear} onSubmit={onConfirm} onKeywordChange={onKeywordChange} />;
  return <FlexBar css={searchBarStyles.bar} flexLeft={left} flexRight={null} />;
}
