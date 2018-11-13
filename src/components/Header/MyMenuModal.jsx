import React from 'react';

const MyMenuModal = ({ userId }) => (
  <div>
    <p>
      <strong>{userId}</strong> 님
    </p>
    <ul>
      <li>
        <button type="button">숨김 도서 목록</button>
      </li>
      <li>
        <button type="button">구매 목록 엑셀 다운로드</button>
      </li>
    </ul>
    <button type="button">로그아웃</button>
  </div>
);

export default MyMenuModal;
