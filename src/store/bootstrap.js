import Router from 'next/router';
import config from '../config';
import { startAccountTracker } from '../services/account/actions';
import { loadActualPage } from '../services/common/actions';
import { setMaintenance } from '../services/maintenance/actions';
import { getMaintenanceStatus } from '../services/maintenance/requests';
import { locationFromUrl } from '../services/router/utils';
import { locationChange } from '../services/tracking/actions';
import settings from '../utils/settings';

const beforeCreatingStore = (initialState, context) => {
  const newInitialState = { ...initialState };

  if (context.isServer) {
    newInitialState.router = {
      beforeLocation: null,
      location: locationFromUrl(context.asPath),
    };
  }

  // TODO: SSR Enable할때 아래 조건문 제거
  // Local 개발 서버의 경우 NextJS 서버를 그대로 사용한다.
  // 해당 로직을 Client Only로 실행할 경우 서버에서는 Portrait 기반으로 DOM을 내려준다.
  // 만약 Client Cookie에 Landscape로 설정되어 있는 경우
  // hydrate로 인해 Portrait과 Landscape의 혼종이 발생한다.
  if (!context.isServer || config.ENVIRONMENT === 'local') {
    // Cookie로 부터 데이터 로드
    const { viewType } = settings;
    if (viewType) {
      newInitialState.ui = {
        ...newInitialState.ui,
        viewType,
      };
    }
  }

  return newInitialState;
};

const afterCreatingStore = async (store, context) => {
  // General

  // Client Only
  if (!context.isServer) {
    const maintenanceStatue = await getMaintenanceStatus();
    await store.dispatch(
      setMaintenance({
        ...maintenanceStatue,
      }),
    );
    if (!maintenanceStatue.isShow) {
      await store.dispatch(loadActualPage());

      // TODO: LRU버그로 인해 주석처리
      // await store.dispatch(loadBookDataFromStorage());
      await store.dispatch(startAccountTracker());

      Router.events.on('routeChangeComplete', url => store.dispatch(locationChange(url)));
    }
  }
};

export default {
  beforeCreatingStore,
  afterCreatingStore,
};
