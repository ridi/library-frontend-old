import React from 'react';

const IconButton = ({ a11y, onClick, className, children }) => (
  <button type="button" onClick={onClick} className={className}>
    {children}
    <span className="a11y">{a11y}</span>
  </button>
);

export default IconButton;
