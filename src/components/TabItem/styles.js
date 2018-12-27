export const tabItem = {
  display: 'inline-block',
  position: 'relative',
  verticalAlign: 'top',
  marginRight: 8,
  background: 'white',
};

export const activeBar = {
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
  height: 3,
  background: 'white',
  transition: 'background .3s',
  '.active & ': {
    background: '#9ea7ad',
  },
};

export const tabButton = {
  padding: '0 8px',
  height: 40,
  lineHeight: '40px',
  color: '#808991',
  fontSize: 16,
  textAlign: 'center',
  '.active & ': {
    color: '#40474d',
    fontWeight: 700,
  },
};
