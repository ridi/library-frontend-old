/** @jsx jsx */
import { jsx } from '@emotion/core';
import EditingBar from '../../../components/EditingBar';
import TitleBar from '../../../components/TitleBar';
import * as styles from './styles';

export const TitleAndEditingBar = ({ titleBarProps, editingBarProps }) => (
  <div css={styles.LNBWrapper}>
    <TitleBar edit {...titleBarProps} />
    {editingBarProps.isEditing && <EditingBar {...editingBarProps} />}
  </div>
);
