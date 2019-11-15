import { MQ, Responsive } from '../../styles/responsive';

export const searchBar = {
  backgroundColor: '#f3f4f5',
  borderBottom: '1px solid #d1d5d9',
  boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .04)',
};

export const searchBoxWrapper = {
  flex: 'auto',
  maxWidth: 600,
  '.hideTools & ': {
    ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large], {
      maxWidth: '100%',
    }),
  },
};

export const toolsWrapper = {
  flex: 'auto',
  justifyContent: 'flex-end',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 2,
  whiteSpace: 'nowrap',
  '.hideTools & ': {
    ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large], {
      display: 'none',
    }),
  },
};

export const cancelSearchButton = {
  display: 'block',
  marginLeft: 14,
  borderRadius: 4,
  boxShadow: '1px 1px 1px 0 rgba(0, 0, 0, .05)',
  backgroundColor: 'white',
  border: '1px solid #d1d5d9',
  width: 50,
  height: 28,
  lineHeight: '28px',
  fontSize: 13,
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#808991',
};
