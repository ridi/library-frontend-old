import Tool from '../Tool';
import FlexBar from '../FlexBar';

const SeriesToolBar = ({ toggleEditingMode }) => <FlexBar renderFlexRight={() => <Tool edit toggleEditingMode={toggleEditingMode} />} />;

export default SeriesToolBar;
