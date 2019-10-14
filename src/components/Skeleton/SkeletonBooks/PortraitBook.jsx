const styles = {
  portraitBook: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
  },
  thumbnail: {
    width: '100%',
    height: 'auto',
    paddingBottom: '162%',
    backgroundImage: 'linear-gradient(147deg, #e6e8eb, #edeff2 55%, #e6e8eb)',
  },
};

const PortraitBook = () => (
  <div css={styles.portraitBook}>
    <div css={styles.thumbnail} />
  </div>
);
export default PortraitBook;
