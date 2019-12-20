import React from 'react';

import Filler from 'components/Filler';
import FullScreenLoading from 'components/FullScreenLoading';

const PageLoadingSpinner = () => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Filler />
      {visible && <FullScreenLoading />}
    </>
  );
};

export default PageLoadingSpinner;
