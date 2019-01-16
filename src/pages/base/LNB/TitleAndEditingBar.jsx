/** @jsx jsx */
import { jsx } from '@emotion/core';
import EditingBar from '../../../components/EditingBar';
import TitleBar from '../../../components/TitleBar';
import * as styles from './styles';

const TitleAndEditingBar = ({ titleBarProps, editingBarProps }) => (
  <div css={styles.LNBWrapper}>
    <TitleBar {...titleBarProps} />
    {editingBarProps.isEditing && <EditingBar {...editingBarProps} />}
  </div>
);

export default TitleAndEditingBar;
