import React from 'react';

import FullScreenLoading from '../../../components/FullScreenLoading';

const PageLoadingSpinner = () => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return visible ? <FullScreenLoading /> : null;
};

export default PageLoadingSpinner;
