import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import config from '../../config';
import * as accountSelectors from '../../services/account/selectors';
import Footer from '../base/Footer';
import * as loginStyles from './styles';

function Login(props) {
  const { location: next, needLogin } = props;
  const returnUrl = new URL(next.pathname, config.BASE_URL);
  returnUrl.search = next.search;
  returnUrl.hash = next.hash;
  const returnUrlString = returnUrl.toString();

  const loginUrl = new URL(config.RIDI_TOKEN_AUTHORIZE_URL);
  loginUrl.searchParams.set('client_id', config.RIDI_OAUTH2_CLIENT_ID);
  loginUrl.searchParams.set('redirect_uri', returnUrlString);
  loginUrl.searchParams.set('response_type', 'code');
  const signupUrl = new URL('/account/signup', config.STORE_API_BASE_URL);
  signupUrl.searchParams.set('return_url', returnUrlString);

  if (!needLogin) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>로그인 - 내 서재</title>
      </Helmet>
      <div css={loginStyles.fixedStyle}>
        <main css={loginStyles.mainStyle}>
          <p css={loginStyles.messageStyle}>
            로그아웃 상태입니다.
            <br />
            로그인하여 내 서재를 확인해보세요.
          </p>
          <div>
            <a css={loginStyles.loginButtonStyle} href={loginUrl.toString()}>
              로그인
            </a>
          </div>
          <div>
            <a css={loginStyles.signupButtonStyle} href={signupUrl.toString()}>
              회원가입
            </a>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

function mapStateToProps(state) {
  return {
    needLogin: accountSelectors.getNeedLogin(state),
  };
}

export default connect(mapStateToProps)(Login);
