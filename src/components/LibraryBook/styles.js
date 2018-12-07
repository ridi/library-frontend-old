import { css } from '@emotion/core';

export const bookCss = css`
  position: relative;
  -webkit-tap-highlight-color: transparent;
  margin: 20px 32px 0 26px;
  & .RSGBookThumbnail_Link,
  & .RSGBookMetadata_Title {
    cursor: pointer;
  }
`;

export const portraitBookCSS = css`
  width: 90px;
  margin: -8px auto;
  vertical-align: top;

  & .RSGBookThumbnail,
  & .RSGBookMetadata {
    margin: 8px 0;
  }

  & .RSGBookThumbnail {
    display: flex;
    align-items: flex-end;
  }

  & .RSGBookMetadata_Authors,
  & .RSGBookMetadata_StarRate {
    margin-top: 3px;
    font-size: 12px;
  }
  & .RSGBookMetadata_Authors {
    line-height: 1.3em;
  }
  & .RSGBookMetadata_Price {
    margin-top: 6px;
  }

  & .RSGBookMetadata_Authors-placeholder {
    width: 65%;
  }

  & .RSGBookMetadata {
    color: rgb(102, 102, 102);
    font-size: 13px;
  }

  & .RSGBookMetadata_Title {
    max-height: 2.8em;
    color: rgb(51, 51, 51);
    letter-spacing: -0.03em;
    line-height: 1.4em;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
    display: block;
    display: -webkit-box;
    box-orient: vertical;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  & .RSGBookMetadata_Title {
    font-weight: 700;
  }

  & .RSGBookThumbnail {
    display: flex;
    align-items: flex-end;
  }

  & .RSGBookThumbnail_Link {
    display: block;
    position: relative;
    width: 100%;
    height: auto;
    max-height: inherit;
  }

  & .RSGBookThumbnail_CoverImage {
    display: block;
    position: relative;
    width: 100%;
    height: auto;
    max-height: inherit;
    background-color: rgb(209, 213, 217);
  }

  & .RSGBookThumbnail_CoverImage.RSGBookThumbnail_CoverImage-placeholder {
    position: absolute;
    height: 100%;
    background-color: transparent;
    box-shadow: none;
  }

  & .RSGBookThumbnail_CoverImage_Shadow {
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.1) 100%);
    border: solid 1px rgba(0, 0, 0, 0.1);
  }

  & .LibraryBook_ExpiredCover {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }

  & .LibraryBook_ExpiredCover_Icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    transform: translate3d(-50%, -50%, 0);
    background: url(book/expired.png) left top no-repeat;
    background-size: 100% 100%;
  }
`;

export const unitCountCss = css`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  z-index: 2;

  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  border: solid 1px white;
  background: rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.7);
`;

export const unitCountTextCss = css`
  display: inline-block;
  height: 1em;
  color: white;
  font-weight: 700;
  line-height: 1em;
`;

export const unitCountIconCss = css`
  width: 4px;
  height: 7px;
  margin-left: 4px;
  vertical-align: middle;
  fill: #fff;
`;

export const expireDateTextCss = css`
  margin-top: 3px;
  color: orange;
  font-size: 12px;
  letter-spacing: -0.07em;
`;

export const expireDateIconCss = css`
  width: 11px;
  height: 11px;
  margin-right: 2px;
  vertical-align: top;
  color: orange;
`;

export const expireDateExpiredCss = css`
  color: #999999;
`;

export const bandCss = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
`;

export const bandIconCss = css`
  margin-right: 3px;
  margin-left: 5px;
  vertical-align: baseline;
  fill: white;
`;
export const expiredBandIconCss = css`
  width: 10px;
  height: 10px;
`;

export const ridiselectBandIconCss = css`
  width: 10px;
  height: 8px;
`;

export const bandTextCss = css`
  color: white;
  font-size: 11px;
  line-height: 20px;
  font-size: 12px;
`;
