export const getDeviceInfo = () => {
  const { appVersion } = navigator;
  const isIos = /iphone|ipad|ipod/gi.test(appVersion);
  const isAndroid = /android/gi.test(appVersion);
  const isIE = /MSIE|Trident\//g.test(appVersion);
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  return {
    appVersion,
    isIos,
    isAndroid,
    isIE,
    isFirefox,
  };
};
