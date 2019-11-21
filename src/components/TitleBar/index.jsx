import FlexBar from 'components/FlexBar';
import * as searchBarStyles from 'components/SearchBar/styles';
import Editing from 'components/Tool/Editing';
import More from 'components/Tool/More';

import * as styles from './styles';
import Title from './Title';

const TitleBar = ({
  backLocation,
  title,
  showCount,
  totalCount,
  showTools,
  toggleEditingMode,
  onBackClick,
  right,
  invertColor = false,
}) => {
  const renderLeft = () => (
    <Title
      title={title}
      showCount={showCount}
      totalCount={totalCount}
      to={backLocation}
      onBackClick={onBackClick}
      invertColor={invertColor}
    />
  );
  const renderRight = () => {
    if (showTools) {
      return (
        <div css={searchBarStyles.toolsWrapper}>
          <Editing toggleEditingMode={toggleEditingMode} />
          <More showViewType />
        </div>
      );
    }
    if (right) return right;
    return null;
  };
  return (
    <FlexBar
      className={`${invertColor ? styles.InvertColor : ''}`}
      css={styles.TitleBar}
      flexLeft={renderLeft()}
      flexRight={renderRight()}
    />
  );
};

export default TitleBar;
