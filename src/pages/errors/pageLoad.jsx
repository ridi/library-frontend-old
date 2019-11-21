import React from 'react';

import { PageLoadError } from '../../components/Error';
import HorizontalRuler from '../../components/HorizontalRuler';

const PageLoad = () => (
  <>
    <HorizontalRuler color="#d1d5d9" />
    <PageLoadError />
  </>
);

export default PageLoad;
