import Shelf from '../Shelf';
import { ShelvesWrapper } from '../ShelvesWrapper';

export const Shelves = ({ shelfIds, selectMode, renderLink }) => (
  <ShelvesWrapper>
    {shelfIds.map(uuid => (
      <div key={uuid} className="shelf">
        <Shelf uuid={uuid} selectMode={selectMode} renderLink={renderLink} />
      </div>
    ))}
  </ShelvesWrapper>
);
