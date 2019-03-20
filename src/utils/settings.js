import Cookies from './cookies';

const SettingKeyPrefix = 'ridi_lib';
const SettingKey = {
  VIEW_TYPE: 'VIEW_TYPE',
};

class Settings {
  constructor() {
    this.cookies = Cookies;
    this.ctx = null;
  }

  setContext(ctx) {
    this.ctx = ctx;
  }

  makeKey(key) {
    return `${SettingKeyPrefix}:key`;
  }

  get(keySalt) {
    const key = this.makeKey(keySalt);
    return this.cookies.get(this.ctx, key);
  }

  set(keySalt, val, options) {
    const key = this.makeKey(keySalt);
    this.cookies.set(this.ctx, key, val, options);
  }

  migrate() {
    // 마이그레이션 코드는 필연적으로 노가다가 될 수 밖에 없다..

    // SET_VIEW_TYPE -> ridi_lib:VIEW_TYPE
    // TOOLTIP -> ridi_lib:TOOLTIP
    // NEW_LIBRARY -> ridi_lib:NEW_LIBRARY
    const viewType = this.cookies.get(this.ctx, 'SET_VIEW_TYPE');
    const tooltip = this.cookies.get(this.ctx, 'TOOLTIP');
    const newLibrary = this.cookies.get(this.ctx, 'NEW_LIBRARY');

    if (viewType) {
      this.viewType = viewType;
      this.cookies.delete(this.ctx, 'SET_VIEW_TYPE');
    }

    if (tooltip) {
      this.set('TOOLTIP', tooltip, { path: '/', expires: new Date(2019, 3, 25) });
      this.cookies.delete(this.ctx, 'TOOLTIP');
    }

    if (newLibrary) {
      this.set('NEW_LIBRARY', newLibrary, { path: '/', expires: new Date(2019, 3, 25) });
      this.cookies.delete(this.ctx, 'NEW_LIBRARY');
    }
  }

  // 아래로 특정 고정 키 셋팅
  get viewType() {
    return this.get(SettingKey.VIEW_TYPE);
  }

  set viewType(val) {
    return this.set(SettingKey.VIEW_TYPE, val, { path: '/' });
  }
}

const settings = new Settings();
export default settings;
