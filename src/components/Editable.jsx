import BottomActionBar from './BottomActionBar';
import EditingBar from './EditingBar';
import FixedToolbarView from './FixedToolbarView';

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
