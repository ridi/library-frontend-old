import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { initTracker, trackPage } from 'services/tracking/actions';

const TrackManager = props => {
  const account = useSelector(state => state.account);
  const dispatch = useDispatch();

  const {
    location: { pathname },
  } = props;

  React.useEffect(() => {
    dispatch(trackPage(pathname));
  }, [account, pathname]);

  React.useEffect(() => {
    dispatch(initTracker());
  }, [account]);

  return null;
};

export default withRouter(TrackManager);
