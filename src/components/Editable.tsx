import React from 'react';

import BottomActionBar from './BottomActionBar';
import EditingBar from './EditingBar';
import FixedToolbarView from './FixedToolbarView';

interface Props {
  actionBarProps?: any;
  allowFixed?: boolean;
  doubleEditBar?: boolean;
  editingBarProps?: any;
  isEditing?: boolean;
  nonEditBar: React.ReactNode;
}

export default function Editable(props: Props & { children?: React.ReactNode }) {
  const { actionBarProps, allowFixed, children, doubleEditBar, editingBarProps, isEditing, nonEditBar } = props;
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
