/** @jsx jsx */
import { jsx } from '@emotion/core';
import FixedToolbarView from './FixedToolbarView';
import EditingBar from './EditingBar';
import BottomActionBar from './BottomActionBar';

export default function Editable({ actionBarProps, allowFixed, children, doubleEditBar, editingBarProps, isEditing, nonEditBar }) {
  return (
    <FixedToolbarView
      allowFixed={allowFixed}
      doubleToolbar={!isEditing && doubleEditBar}
      toolbar={isEditing ? <EditingBar {...editingBarProps} /> : nonEditBar}
      actionBar={isEditing ? <BottomActionBar {...actionBarProps} /> : null}
    >
      {children}
    </FixedToolbarView>
  );
}
