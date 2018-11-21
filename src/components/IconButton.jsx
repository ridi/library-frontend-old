import React from 'react';
import { Icon } from '@ridi/rsg';

const IconButton = ({ icon, a11y, onClick, className }) => (
  <button type="button" onClick={onClick} className={className}>
    <Icon name={icon} />
    <span className="a11y">{a11y}</span>
  </button>
);

export default IconButton;
