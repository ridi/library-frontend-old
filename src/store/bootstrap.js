
import { loadUserInfo } from '../services/account/actions';

import { loadBookData, startPersistTimer } from '../services/book/actions';


const bootstrap = async store => {
  await store.dispatch(loadUserInfo());
  await store.dispatch(startPersistTimer());
  await store.dispatch(loadBookDataFromStorage());
  // Temp
  // await store.dispatch(loadBookData(['2066000162', '745000083']));
};


export default bootstrap;
