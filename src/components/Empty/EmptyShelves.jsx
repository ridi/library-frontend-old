import React from 'react';
import Empty from './index';
import Shelves from '../../svgs/Shelves.svg';

export const EmptyShelves = () => <Empty IconComponent={Shelves} message="책장 목록이 없습니다." iconWidth={47} />;
