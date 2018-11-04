import React from 'react';

const Option = ({ title, value }) => <option value={value}>{title}</option>;

const createOptions = options =>
  options.map(
    option =>
      option.hasChildren ? (
        <OptionGroup
          key={`${option.value}.$0`}
          rootOption={option}
          childOptions={option.children}
        />
      ) : (
        <Option key={option.value} title={option.title} value={option.value} />
      ),
  );

const OptionGroup = ({ rootOption, childOptions }) => (
  <optgroup label={rootOption.title}>
    <Option title={`${rootOption.title} 전체`} value={rootOption.value} />
    {createOptions(childOptions)}
  </optgroup>
);

export default ({ options }) =>
  options && options.length > 0 ? createOptions(options) : null;
