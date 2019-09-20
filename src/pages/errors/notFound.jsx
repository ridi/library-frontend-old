import React from 'react';
import { NotFoundError } from '../../components/Error';
import HorizontalRuler from '../../components/HorizontalRuler';

const NotFound = () => (
  <>
    <HorizontalRuler color="#d1d5d9" />
    <NotFoundError />
  </>
);

export default NotFound;
