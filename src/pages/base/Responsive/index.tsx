import React from 'react';

import * as styles from './styles';

const Responsive: React.FC<{ className?: string }> = ({ className, children }) => {
  const hasPadding = true;
  const minHeight = false;
  return (
    <div className={className}>
      <div css={styles.responsive(hasPadding, minHeight)}>{children}</div>
    </div>
  );
};

export const ResponsiveBooks: React.FC<{ className?: string }> = ({ className, children }) => {
  const hasPadding = false;
  const minHeight = true;
  return (
    <div className={className}>
      <div css={styles.responsive(hasPadding, minHeight)}>{children}</div>
    </div>
  );
};

export default Responsive;
