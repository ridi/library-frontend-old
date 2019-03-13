import React from 'react';
import { NotFoundError } from '../../components/Error';
import HorizontalRuler from '../../components/HorizontalRuler';

export default class NotFound extends React.Component {
  render() {
    return (
      <>
        <HorizontalRuler color="#d1d5d9" />
        <NotFoundError />
      </>
    );
  }
}
