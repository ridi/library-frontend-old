import { stringify } from 'qs';

// 앱 호출 URI를 안드로이드 intent를 이용해 호출할 수 있는 URI로 변환해주는 함수
const convertUriToAndroidIntentUri = (uri, packageName) => {
  const scheme = /(.+):\/\//.exec(uri)[1];

  /* 줄바꿈시 공백이 들어가서 다운로드 URI 오류 발생 */
  return `${uri.replace(
    `${scheme}://`,
    'intent://',
  )}#Intent;scheme=${scheme};action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=${packageName};end`;
};

const launchAppToDownload = appUri => {
  const { appVersion } = navigator;
  const isIos = /iphone|ipad|ipod/gi.test(appVersion);
  const isAndroid = /android/gi.test(appVersion);
  const isIE = /MSIE|Trident\//g.test(appVersion);
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  const start = new Date();

  // 만약 앱이 깔려있으면 iframe에 주소가 세팅되자마자 앱이 실행되서 아래 함수가 실제로 실행되지 않는 원리를 이용함
  const installTimer = setTimeout(() => {
    // 이렇게 빨리 여기로 들어오면 앱이 실행되지 않았다고 판단
    if (new Date() - start < 2500) {
      if (isIos) {
        window.location.href = 'http://itunes.apple.com/kr/app/id338813698?mt=8';
      } else if (isAndroid) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.initialcoms.ridi';
      } else {
        console.log('리디북스 뷰어 내 구매 목록에서 다운로드해주세요.');
        // TODO: Add toast
        // $('#iframe_book_download').attr('src', '');
        // toast.show({
        //   text: '리디북스 뷰어 내 구매 목록에서 다운로드해주세요.',
        //   linkUrl: '/support/app',
        //   linkTitle: '이용 방법 보기',
        // }, 8000);
      }
    }
  }, 1500);

  if (isIos) {
    try {
      window.location = appUri;
    } catch (e) {
      // TODO: Handle error.
    }
  } else if (isAndroid) {
    const androidUri = isFirefox ? appUri : convertUriToAndroidIntentUri(appUri, 'com.initialcoms.ridi');

    setTimeout(() => {
      try {
        document.location.href = androidUri;
      } catch (e) {
        document.location.href = appUri;
      }

      clearTimeout(installTimer);
    }, 300);
  } else {
    // $('#iframe_book_download').attr('src', appUri);
  }

  return false;
};

const download = (bookIds, url) => {
  const appUri = `${url}&payload=${stringify({ b_ids: bookIds })}`;
  launchAppToDownload(appUri);
};

export default download;
