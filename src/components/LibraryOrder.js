import React from 'react';

import Options from './Options';

const LibraryOrder = ({ options, selected, onChange }) => {
  return (
    <select name="order" title="order" value={selected} onChange={e => onChange(e.target.value)}>
      <Options options={options} />
    </select>
  );
};

export default LibraryOrder;
