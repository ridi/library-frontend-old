/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import config from '../config';
import { makeLoginURI } from '../utils/uri';
import Footer from './base/Footer';

const fixedStyle = {
  borderTop: '1px solid #d1d5d9',
  width: '100%',
  minHeight: 350,
  paddingTop: 46,
};

const mainStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: 300,
  marginTop: -200,
  marginLeft: -150,
};

const messageStyle = {
  width: '100%',
  lineHeight: '1.5em',
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#40474d',
  marginBottom: 16,
};

const defaultButtonStyle = {
  marginTop: 8,
  width: 300,
  display: 'inline-block',
  lineHeight: '50px',
  borderRadius: 4,
  textAlign: 'center',
  fontSize: 16,
  fontWeight: 'bold',
  boxSizing: 'border-box',
};

const loginButtonStyle = {
  ...defaultButtonStyle,
  boxShadow: '1px 1px 1px 0 rgba(31, 140, 230, 0.3)',
  backgroundColor: '#1f8ce6',
  border: '1px solid #0077d9',
  color: '#fff',
};

const signupButtonStyle = {
  ...defaultButtonStyle,
  boxShadow: '1px 1px 1px 0 rgba(209, 213, 217, 0.3)',
  backgroundColor: '#ffffff',
  border: '2px solid #d1d5d9',
  color: '#808991',
};

class Login extends React.Component {
  render() {
    const loginUrl = makeLoginURI(config.RIDI_TOKEN_AUTHORIZE_URL, config.RIDI_OAUTH2_CLIENT_ID, config.BASE_URL);
    const sighupUrl = `${config.STORE_API_BASE_URL}/account/signup?return_url=${encodeURIComponent(config.BASE_URL)}`;

    return (
      <>
        <Head>
          <title>로그인 - 내 서재</title>
        </Head>
        <div css={fixedStyle}>
          <main css={mainStyle}>
            <p css={messageStyle}>
              로그아웃 상태입니다.
              <br />
              로그인하여 내 서재를 확인해보세요.
            </p>
            <div>
              <a css={loginButtonStyle} href={loginUrl}>
                로그인
              </a>
            </div>
            <div>
              <a css={signupButtonStyle} href={sighupUrl}>
                회원가입
              </a>
            </div>
          </main>
        </div>
        <Footer />
      </>
    );
  }
}

export default Login;
