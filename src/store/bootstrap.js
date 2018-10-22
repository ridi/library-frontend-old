
import { loadUserInfo } from '../services/account/actions';

import { loadBookData } from '../services/book/actions';


const bootstrap = async store => {
  await store.dispatch(loadUserInfo());

  // Temp
  await store.dispatch(loadBookData(['2066000162', '745000083']));
};


export default bootstrap;
