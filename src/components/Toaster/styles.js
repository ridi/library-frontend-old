export const toastWrapper = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 50,
};

export const toast = {
  boxSizing: 'border-box',
  width: 340,
  margin: '10px auto',
  padding: 15,

  opacity: 0.9,
  borderRadius: 4,
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
  backgroundColor: 'black',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

export const toastTypeMark = {
  width: 15,
  height: 15,
  marginRight: 6,
  alignSelf: 'flex-start',

  backgroundColor: '#5abf0d',
};

export const toastContent = {
  fontSize: 14,
  letterSpacing: -0.7,
  color: '#5abf0d',

  wordBreak: 'break-word',
  flex: 1,
};
export const toastLink = {
  fontSize: 13,
  fontWeight: 'bold',
  letterSpacing: -0.7,
  textAlign: 'right',
  color: 'white',
};

export const toastCloseButton = {
  marginLeft: 15,
  width: 15,
  height: 15,

  backgroundColor: '#666666',
};
