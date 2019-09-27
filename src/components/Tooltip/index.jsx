/** @jsx jsx */
import { jsx } from '@emotion/core';
import { isBefore } from 'date-fns';
import React, { useState, useEffect } from 'react';
import CheckIcon from '../../svgs/Check.svg';
import * as toolTipStyles from './styles';
import { TooltipBackground } from './TooltipBackground';
import settings from '../../utils/settings';

export const Tooltip = ({ children, name, expires, style, horizontalAlign }) => {
  const [isActive, setActive] = useState(false);

  const showTooltip = isTooltipActive => {
    setActive(isTooltipActive);
  };

  useEffect(
    () => {
      const isTooltipActive = !settings.get(name);
      if (expires && isBefore(new Date(), expires) && isTooltipActive) {
        settings.set(name, true, { path: '/', expires });
        showTooltip(isTooltipActive);
      }
    },
    [name],
  );

  useEffect(
    () => {
      if (isActive) {
        window.addEventListener('scroll', handleScroll);
      }
      return window.removeEventListener('scroll', handleScroll);
    },
    [isActive],
  );

  const handleScroll = () => {
    setActive(false);
    window.removeEventListener('scroll', handleScroll);
  };

  const onClickTooltipBackground = React.useCallback(() => setActive(false), []);

  return isActive ? (
    <React.Fragment>
      <div css={[toolTipStyles.tooltip(isActive, horizontalAlign), style]}>
        {children}
        <div css={toolTipStyles.checkIconWrapper}>
          <CheckIcon css={toolTipStyles.checkIcon} />
        </div>
      </div>
      <TooltipBackground isActive={isActive} onClickTooltipBackground={onClickTooltipBackground} />
    </React.Fragment>
  ) : null;
};
