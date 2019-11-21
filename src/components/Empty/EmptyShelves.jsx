import React from 'react';

import Shelves from '../../svgs/Shelves.svg';
import Empty from './index';

export const EmptyShelves = () => <Empty IconComponent={Shelves} message="책장이 없습니다." iconWidth={47} />;
