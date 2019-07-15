import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

function PageRedirect(props) {
  const { currentPage, location, totalPages } = props;
  if (totalPages <= 0) {
    return null;
  }

  const realPage = Math.max(1, Math.min(totalPages, currentPage));
  if (currentPage === realPage) {
    return null;
  }

  const newUrlParams = new URLSearchParams(location.search);
  newUrlParams.set('page', realPage);
  const newSearch = newUrlParams.toString();
  const to = {
    ...location,
    search: newSearch !== '' ? `?${newSearch}` : '',
  };
  return <Redirect to={to} />;
}

export default withRouter(PageRedirect);
