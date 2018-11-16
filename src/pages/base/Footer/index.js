import React from 'react';
import { Icon } from '@ridi/rsg';

const Footer = () => (
  <footer className="Footer Footer-dark">
    <ul className="Footer_Headline_List">
      <li className="Footer_Headline_Item">
        <a className="Footer_Headline_Link" href="https://ridibooks.com/support/app/download" target="_blank" rel="noopener noreferrer">
          <Icon name="app_ridi_1" className="Ridibooks_Logo_Icon" />
          뷰어 다운로드
        </a>
      </li>
      <li className="Footer_Headline_Item">
        <a className="Footer_Headline_Link" href="/guide">
          이용 방법
        </a>
      </li>
    </ul>
    <ul className="Footer_BizInfo_List">
      <li className="Footer_BizInfo_Item">서울시 강남구 역삼동 702-28 어반벤치빌딩 10층(테헤란로 325)</li>
      <li className="Footer_BizInfo_Item">
        <ul className="CompanyInfo_List">
          <li className="CompanyInfo_Item">리디 (주)</li>
          <li className="CompanyInfo_Item">대표 배기식</li>
          <li className="CompanyInfo_Item">사업자등록번호 120-87-27435</li>
        </ul>
      </li>
      <li className="Footer_BizInfo_Item">통신판매업신고 제 2009-서울강남 35-02139호</li>
    </ul>
    <ul className="Footer_Terms_List">
      <li className="Footer_Terms_Item">
        <a className="Footer_Term_Link" href="/books">
          서비스 도서 목록
        </a>
      </li>
      <li className="Footer_Terms_Item">
        <a className="Footer_Term_Link" href="https://ridibooks.com/legal/terms" target="_blank" rel="noopener noreferrer">
          이용약관
        </a>
      </li>
      <li className="Footer_Terms_Item">
        <a
          className="Footer_Term_Link Personal_Info_Term_Link"
          href="https://ridibooks.com/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          개인 정보 처리 방침
        </a>
      </li>
      <li className="Footer_Terms_Item">
        <a className="Footer_Term_Link" href="https://ridibooks.com/legal/youth" target="_blank" rel="noopener noreferrer">
          청소년 보호 정책
        </a>
      </li>
    </ul>
    <p className="Footer_Copyright">© RIDI Corp.</p>
  </footer>
);

export default Footer;
