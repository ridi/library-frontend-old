import React from 'react';
import classname from 'classnames';
import * as styles from './styles';

const Responsive = ({ className, children }) => <div className={classname(styles.Responsive, className)}>{children}</div>;
export default Responsive;
