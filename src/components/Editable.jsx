import React from 'react';
import EditingBar from './EditingBar';
import BottomActionBar from './BottomActionBar';

const Editable = ({ children, nonEditBar, isEditing, editingBarProps, actionBarProps }) => (
  <>
    {isEditing ? <EditingBar {...editingBarProps} /> : nonEditBar}
    {children}
    {isEditing ? <BottomActionBar {...actionBarProps} /> : null}
  </>
);

export default Editable;
