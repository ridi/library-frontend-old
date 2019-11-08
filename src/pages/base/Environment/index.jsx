import { Environemnt } from 'constants/environment';
import config from '../../../config';

const environmentBandStyle = environment => {
  let background = '';
  if (environment === Environemnt.LOCAL) {
    background = 'darkgray';
  } else if (environment === Environemnt.DEV) {
    background = 'green';
  } else if (environment === Environemnt.STAGING) {
    background = 'red';
  }

  return {
    display: 'block',
    textAlign: 'center',
    padding: '4px',
    fontSize: '12px',
    fontWeight: 900,
    color: 'white',
    background,
  };
};

export const Environment = () => {
  const { ENVIRONMENT: environment } = config;
  switch (environment) {
    case Environemnt.LOCAL:
    case Environemnt.DEV:
      return <p css={environmentBandStyle(environment)}>{environment}</p>;
    case Environemnt.STAGING:
      return (
        <a css={environmentBandStyle(environment)} href={`${config.BASE_URL}/production`}>
          {environment}
        </a>
      );
    default:
      return null;
  }
};
