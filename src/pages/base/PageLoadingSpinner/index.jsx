import { css } from '@emotion/core';
import React from 'react';

import FullScreenLoading from '../../../components/FullScreenLoading';

const filler = css`
  height: 300vh;
`;

const PageLoadingSpinner = () => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div css={filler} />
      {visible && <FullScreenLoading />}
    </>
  );
};

export default PageLoadingSpinner;
