

const loadUserInfo = async store => {};
const loadStateFromLocalstorage = store => {};


const bootstrap = async store => {
  await loadUserInfo(store);
  loadStateFromLocalstorage(store);
};


export default bootstrap;
