import * as styles from './styles';

const Responsive = ({ className, children }) => {
  const hasPadding = true;
  const minHeight = false;
  return (
    <div className={className}>
      <div css={styles.responsive(hasPadding, minHeight)}>{children}</div>
    </div>
  );
};

export const ResponsiveBooks = ({ className, children }) => {
  const hasPadding = false;
  const minHeight = true;
  return (
    <div className={className}>
      <div css={styles.responsive(hasPadding, minHeight)}>{children}</div>
    </div>
  );
};

export default Responsive;
