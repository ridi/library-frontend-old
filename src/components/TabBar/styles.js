export const tabBar = {
  width: '100%',
};

export const tabItem = {
  display: 'inline-block',
  position: 'relative',
  verticalAlign: 'top',
  marginRight: 8,
  background: 'white',
};

export const tabButton = {
  display: 'block',
  padding: '0 2px',
  height: 40,
  lineHeight: '40px',
  color: '#808991',
  fontSize: 16,
  textAlign: 'center',
};

export const tabButtonToggle = isActive =>
  isActive
    ? {
        color: '#40474d',
        fontWeight: 700,
      }
    : {};

export const activeBar = {
  display: 'block',
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
  height: 2,
  background: 'white',
  transition: 'background .3s',
};

export const activeBarToggle = isActive =>
  isActive
    ? {
        background: '#9ea7ad',
      }
    : {};
