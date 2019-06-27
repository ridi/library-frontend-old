export const promptWrapper = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 9999,
  backgroundColor: 'rgba(33, 37, 41, 0.6)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const prompt = {
  borderRadius: 3,
  backgroundColor: 'white',

  width: 300,
  padding: 20,
  boxSizing: 'border-box',
};

export const promptHeader = {
  position: 'relative',
};

export const promptFooter = {};

export const promptTitle = {
  fontSize: 17,
  fontWeight: 'bold',
  lineHeight: 1.41,
  letterSpacing: -0.3,
  color: '#303538',
};

export const promptCloseButton = {
  position: 'absolute',
  top: 0,
  right: 0,

  width: 15,
  height: 15,
  fill: '#d1d5d9',
};

export const promptContent = {
  fontSize: 15,
  color: '#525a61',
  margin: '20px 0',
};

export const promptInputWrapper = {
  position: 'relative',
  marginTop: '12px',
  padding: '14px 10px',
  borderBottom: '1px solid #1f8ce6',
  border: '1px solid #d1d5d9',
  borderRadius: '3px',
  '&.focus': {
    borderColor: '#349cf2',
  },
  '&.invalid': {
    borderColor: '#fabab3',
    paddingRight: '34px',
  },
};

export const invalidIcon = {
  position: 'absolute',
  right: '11px',
  top: '50%',
  width: '12px',
  height: '12px',
  marginTop: '-6px',
  fill: '#e64938',
};

export const invalidInfo = {
  marginTop: '10px',
  fontSize: '12px',
  lineHeight: '15px',
  color: '#e64938',
  paddingLeft: '9px',
};

export const promptInput = {
  display: 'block',
  width: '100%',
  fontSize: '15px',
  color: '#525a61',
  fontWeight: 'bold',
  '&::placeholder': {
    color: '#9ea7ad',
    fontWeight: 'normal',
  },
};

export const promptButton = {
  width: 92,
  height: 40,
  borderRadius: 4,
  backgroundColor: '#1f8ce6',

  fontSize: 14,
  fontWeight: 'bold',
  letterSpacing: -0.3,
  textAlign: 'center',
  color: '#ffffff',
  float: 'right',
};

export const clear = {
  clear: 'both',
};
