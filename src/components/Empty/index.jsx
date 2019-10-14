const styles = {
  wrapper: {
    position: 'relative',
    color: '#40474d',
    width: '100%',
    height: '100%',
    minHeight: 400,
  },
  contents: {
    width: 300,
    height: 100,
    display: 'inline-block',
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -150,
    marginTop: -40,
    fontSize: 15,
    textAlign: 'center',
  },
  icon: {
    fill: '#d1d5d9',
    marginBottom: 20,
  },
};

const Empty = ({ message, IconComponent, iconWidth = 30, iconHeight = 38 }) => {
  const iconSize = { width: iconWidth, height: iconHeight };
  return (
    <div css={styles.wrapper}>
      <div css={styles.contents}>
        {IconComponent && <IconComponent css={[styles.icon, iconSize]} />}
        <br />
        {message}
      </div>
    </div>
  );
};

export default Empty;
