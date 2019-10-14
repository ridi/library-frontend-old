import React from 'react';
import { withRouter } from 'react-router-dom';

function ScrollManager({ location }) {
  const previousLocation = React.useRef(null);
  const scrollPositionMap = React.useRef(new Map());
  const scrollPosition = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    scrollPosition.current.x = window.scrollX;
    scrollPosition.current.y = window.scrollY;
  }, []);

  React.useEffect(() => {
    const positionMap = scrollPositionMap.current;
    if (previousLocation.current != null) {
      // 여기서 window의 스크롤 위치를 캡처하면 이전 상태를 가져올 수 없다
      // 내용이 짧아져 스크롤이 이동했을 수 있기 때문...
      positionMap.set(previousLocation.current.key, { ...scrollPosition.current });
    }
    previousLocation.current = location;

    const handleScroll = () => {
      scrollPosition.current.x = window.scrollX;
      scrollPosition.current.y = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    const { key, state } = location;
    if (positionMap.has(key)) {
      // 방문한 적 있는 페이지, 브라우저가 스크롤 위치를 복구하므로 그에 따라간다
      scrollPosition.current.x = window.scrollX;
      scrollPosition.current.y = window.scrollY;
    } else {
      // state에 주어진 명령에 따라 스크롤 위치를 조작한다
      let position = { x: 0, y: 0 };
      if (state != null && state.scroll != null) {
        const { scroll } = state;
        if ('from' in scroll) {
          position = positionMap.get(scroll.from) || position;
        } else if ('x' in scroll && 'y' in scroll) {
          position = {
            x: Number(scroll.x),
            y: Number(scroll.y),
          };
        }
      }
      // 이벤트 리스너에 스크롤 위치가 전달되므로 따로 저장할 필요가 없다
      window.scrollTo(position.x, position.y);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  return null;
}

export default withRouter(ScrollManager);
