import React from 'react';

const IconButton = ({ a11y, children, ...buttonProps }) => (
  <button type="button" {...buttonProps}>
    {children}
    <span className="a11y">{a11y}</span>
  </button>
);

export default IconButton;
