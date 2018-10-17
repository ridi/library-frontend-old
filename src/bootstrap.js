

const loadUserInfo = async store => {};
const loadStateFromLocalstorage = store => {};


const bootstrap = async (store, isServer) => {
  if (isServer) {
    return;
  }

  await loadUserInfo(store);
  loadStateFromLocalstorage(store);
};


export default bootstrap;
