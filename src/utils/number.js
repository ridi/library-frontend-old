export const thousandsSeperator = value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const numberWithUnit = value => {
  let floorNums = 0;
  let unit = '';

  if (value < 1000) {
    floorNums = value;
  } else if (value < 10000) {
    floorNums = Math.round(value / 100) / 10;
    unit = '천';
  } else if (value < 100000000) {
    floorNums = Math.round(value / 1000) / 10;
    unit = '만';
  }

  return floorNums > 0 ? `${floorNums}${unit}` : null;
};
