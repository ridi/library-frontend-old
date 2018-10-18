
import { loadUserInfo } from '../services/account/actions';


const bootstrap = async store => {
  await store.dispatch(loadUserInfo());
};


export default bootstrap;
