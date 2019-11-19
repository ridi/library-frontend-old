import isBefore from 'date-fns/is_before';
import React from 'react';

import CheckIcon from '../../svgs/Check.svg';
import settings from '../../utils/settings';
import * as toolTipStyles from './styles';
import { TooltipBackground } from './TooltipBackground';

export const Tooltip = ({ children, name, expires, style, horizontalAlign }) => {
  const [isActive, setActive] = React.useState(false);

  React.useEffect(() => {
    const isTooltipActive = !settings.get(name);
    if (expires && isBefore(new Date(), expires) && isTooltipActive) {
      settings.set(name, true, { path: '/', expires });
      setActive(isTooltipActive);
    }
  }, [name]);

  React.useEffect(() => {
    function handleScroll() {
      setActive(false);
      window.removeEventListener('scroll', handleScroll);
    }

    if (isActive) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
    return null;
  }, [isActive]);

  const onClickTooltipBackground = React.useCallback(() => setActive(false), []);

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
