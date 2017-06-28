import { push } from 'redux-router';

export default (dispatch, pathname = '/', query = {}) => {
  dispatch(push({
    pathname,
    query,
  }));
};
