export const isEmpty = dict => Object.keys(dict).length === 0;

export const simplifyValues = (dict, allowKeys) => allowKeys.reduce((previous, allowKey) => ({ ...previous, [allowKey]: dict[allowKey] }));
