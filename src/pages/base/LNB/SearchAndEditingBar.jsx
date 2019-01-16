/** @jsx jsx */
import { jsx } from '@emotion/core';
import EditingBar from '../../../components/EditingBar';
import SearchBar from '../../../components/SearchBar';
import * as styles from './styles';

const SearchAndEditingBar = ({ searchBarProps, editingBarProps }) => (
  <div css={styles.LNBWrapper}>
    <SearchBar {...searchBarProps} />
    {editingBarProps.isEditing && <EditingBar {...editingBarProps} />}
  </div>
);

export default SearchAndEditingBar;
