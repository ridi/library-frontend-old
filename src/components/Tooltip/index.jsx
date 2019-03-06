/** @jsx jsx */
import { jsx } from '@emotion/core';
import nookies from 'nookies';
import { isBefore } from 'date-fns';
import { useState, useEffect } from 'react';
import CheckIcon from '../../svgs/Check.svg';
import * as toolTipStyles from './styles';
import { TooltipBackground } from './TooltipBackground';

export const Tooltip = ({ children, name, expires, style, horizontalAlign }) => {
  const [isActive, setActive] = useState(false);

  const showTooltip = isTooltipActive => {
    nookies.set(null, name, isTooltipActive, { path: '/', expires });
    setActive(isTooltipActive);
  };

  useEffect(
    () => {
      if (expires && isBefore(new Date(), expires)) {
        const cookies = nookies.get();
        const isTooltipActive = cookies[name] === undefined || cookies[name] === true;
        showTooltip(isTooltipActive);
      }
    },
    [name],
  );

  useEffect(
    () => {
      if (isActive) {
        window.addEventListener('scroll', () => {
          showTooltip(false);
          window.removeEventListener('scroll');
        });
      }
      return window.removeEventListener('scroll');
    },
    [isActive],
  );

  const onClickTooltipBackground = () => {
    showTooltip(false);
  };

  return isActive ? (
    <>
      <div css={[toolTipStyles.tooltip(isActive, horizontalAlign), style]}>
        {children}
        <div css={toolTipStyles.checkIconWrapper}>
          <CheckIcon css={toolTipStyles.checkIcon} />
        </div>
      </div>
      <TooltipBackground isActive={isActive} onClickTooltipBackground={onClickTooltipBackground} />
    </>
  ) : null;
};
