import React from 'react';
import { withRouter } from 'react-router-dom';

function ScrollManager({ location }) {
  React.useEffect(() => {
    const { key, state } = location;
    if (window.sessionStorage.getItem(key) == null) {
      // state에 주어진 명령에 따라 스크롤 위치를 조작한다
      let position = { x: 0, y: 0 };
      if (state != null && state.scroll != null) {
        const { scroll } = state;
        if ('from' in scroll) {
          const scrollDataRaw = window.sessionStorage.getItem(scroll.from);
          position = scrollDataRaw ? JSON.parse(scrollDataRaw) : position;
        } else if ('x' in scroll && 'y' in scroll) {
          position = {
            x: Number(scroll.x),
            y: Number(scroll.y),
          };
        }
      }
      window.scrollTo(position.x, position.y);
    }

    return () => {
      window.sessionStorage.setItem(key, JSON.stringify({ x: window.scrollX, y: window.scrollY }));
    };
  }, [location]);

  return null;
}

export default withRouter(ScrollManager);
