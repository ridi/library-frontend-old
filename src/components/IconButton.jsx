import React from 'react';
import { Icon } from '@ridi/rsg';

const IconButton = ({ icon, a11y, onClick, className, children }) => (
  <button type="button" onClick={onClick} className={className}>
    {icon && <Icon name={icon} />}
    {children}
    <span className="a11y">{a11y}</span>
  </button>
);

export default IconButton;
