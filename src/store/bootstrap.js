
import { loadUserInfo } from '../services/account/actions';

import { loadBookDataFromStorage } from '../services/book/actions';


const bootstrap = async store => {
  await store.dispatch(loadUserInfo());
  await store.dispatch(loadBookDataFromStorage());
};


export default bootstrap;
