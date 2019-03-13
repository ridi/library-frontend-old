import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';
import config from '../config';
import { URLMap } from '../constants/urls';
import Favicon from './base/Favicon';
import Metadata from './base/Metadata';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const page = renderPage();
    const styles = extractCritical(page.html);

    return { ...page, ...styles };
  }

  constructor(props) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = ids;
    }
  }

  addSearchJSONLD = () => `{
      "@context": "http://schema.org",
      "@type": "WebSite",
      "url": "${config.BASE_URL}/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${config.BASE_URL}${URLMap.search.as}/?keyword={keyword}&amp;referer=sitelinks_searchbox",
        "query-input": "required name=keyword"
      }
    }`;

  render() {
    return (
      <html lang="ko">
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />

          <meta name="apple-mobile-web-app-title" content="내서재" />
          <meta name="apple-mobile-web-app-capable" content="no" />
          <meta name="apple-mobile-web-app-status-bar-style" content="white" />

          <Metadata />
          <Favicon />

          <script type="text/javascript" src="https://account.ridibooks.com/script/ridi_token_refresher.0.0.3.js" />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: this.addSearchJSONLD() }} />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
