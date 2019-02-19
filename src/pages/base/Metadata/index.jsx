import React from 'react';
import config from '../../../config';

const Description = '리디북스에서 구매하고 리디셀렉트에서 추가한 모든 책. 이제 내 서재에서 한 번에 즐겨보세요!';
const Keywords = '구매 목록, 리디 내 서재, 내 서재';
const Title = '내 서재 - 리디';
const Image = `${config.STATIC_URL}/static/OG/library.png`;

const Metadata = () => (
  <>
    <meta name="keywords" content={Keywords} />
    <meta name="description" content={Description} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@ridibooks" />
    <meta property="fb:app_id" content="208688205808637" />
    <meta property="og:url" content={config.BASE_URL} />
    <meta property="og:title" content={Title} />
    <meta property="og:image" content={Image} />
    <meta property="og:description" content={Description} />
  </>
);

export default Metadata;
