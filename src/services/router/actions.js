export const SET_LOCATION = 'SET_LOCATION';
export const COMMIT_LOCATION = 'COMMIT_LOCATION';
export const ROLLBACK_LOCATION = 'ROLLBACK_LOCATION';

export const setLocation = location => ({
  type: SET_LOCATION,
  payload: {
    location,
  },
});

export const commitLocation = () => ({
  type: COMMIT_LOCATION,
});

export const rollbackLocation = () => ({
  type: ROLLBACK_LOCATION,
});
