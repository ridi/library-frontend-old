/** @jsx jsx */
import { jsx } from '@emotion/core';
import shortid from 'shortid';
import { ActionBar, ActionButton } from '../../../components/BottomActionBar';

const BottomActionBar = ({ isEditing, selectedBooks, buttonsProps }) => {
  const disable = Object.keys(selectedBooks).length === 0;
  return isEditing ? (
    <ActionBar>
      {buttonsProps.map(button => (
        <ActionButton key={shortid.generate()} name={button.name} onClick={button.onClick} disable={disable} />
      ))}
    </ActionBar>
  ) : null;
};
export default BottomActionBar;
