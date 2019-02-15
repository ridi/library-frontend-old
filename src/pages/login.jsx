/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import Footer from './base/Footer';

const fixedStyle = {
  width: '100%',
  minHeight: 350,
  paddingTop: 46,
};

const mainStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: 300,
  height: 200,
  marginTop: -160,
  marginLeft: -150,
};

const messageStyle = {
  width: '100%',
  height: 24,
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#40474d',
  marginBottom: 8,
};

const defaultButtonStyle = {
  marginTop: 5,
  width: 300,
  display: 'inline-block',
  lineHeight: '50px',
  borderRadius: 4,
  textAlign: 'center',
  fontSize: 16,
  fontWeight: 'bold',
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
    return (
      <>
        <Head>
          <title>로그인 - 내 서재</title>
        </Head>
        <div css={fixedStyle}>
          <main css={mainStyle}>
            <div css={messageStyle}>로그인을 진행해주세요.</div>
            <div>
              <a css={loginButtonStyle}>로그인</a>
            </div>
            <div>
              <a css={signupButtonStyle}>회원가입</a>
            </div>
          </main>
        </div>
        <Footer />
      </>
    );
  }
}

export default Login;
