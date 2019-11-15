import Cookies from './cookies';

const SettingKey = {
  VIEW_TYPE: 'VIEW_TYPE',
};

class Settings {
  constructor() {
    this.cookies = Cookies;
  }

  static get SETTING_KEY_PREFIX() {
    return 'ridi_lib';
  }

  makeKey(key) {
    return `${this.SETTING_KEY_PREFIX}:${key}`;
  }

  get(keySalt) {
    const key = this.makeKey(keySalt);
    return this.cookies.get(key);
  }

  set(keySalt, val, options) {
    const key = this.makeKey(keySalt);
    this.cookies.set(key, val, options);
  }

  migrate() {
    // 마이그레이션 코드는 필연적으로 노가다가 될 수 밖에 없다..

    // SET_VIEW_TYPE -> ridi_lib:VIEW_TYPE
    // TOOLTIP -> ridi_lib:TOOLTIP
    // NEW_LIBRARY -> ridi_lib:NEW_LIBRARY
    const viewType = this.cookies.get('SET_VIEW_TYPE');
    const tooltip = this.cookies.get('TOOLTIP');
    const newLibrary = this.cookies.get('NEW_LIBRARY');

    if (viewType) {
      this.viewType = viewType;
      this.cookies.delete('SET_VIEW_TYPE');
    }

    if (tooltip) {
      this.set('TOOLTIP', tooltip, { path: '/', expires: new Date(2019, 3, 25) });
      this.cookies.delete('TOOLTIP');
    }

    if (newLibrary) {
      this.set('NEW_LIBRARY', newLibrary, { path: '/', expires: new Date(2019, 3, 25) });
      this.cookies.delete('NEW_LIBRARY');
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
