import Options from './Options';

const SelectBox = ({ options, selected, onChange }) => (
  <select value={selected} onChange={e => onChange(e.target.value)}>
    <Options options={options} />
  </select>
);

export default SelectBox;
