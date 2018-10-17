

const loadUserInfo = async store => {};
const loadStateFromLocalstorage = store => {};


const bootstrap = store => {
  await loadUserInfo(store);
  loadStateFromLocalstorage(store);
};


export default bootstrap;
