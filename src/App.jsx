import React from 'react';
import { initializeApi } from './api';
import { initializeSentry } from './utils/sentry';
import { initializeTabKeyFocus, registerTabKeyUpEvent, registerMouseDownEvent } from './utils/tabFocus';

import Routes from './Routes';

export default function App() {
  React.useEffect(() => {
    initializeTabKeyFocus();
    initializeSentry();
    const body = document.querySelector('body');
    const disposeBag = [];
    disposeBag.push(registerTabKeyUpEvent(body));
    disposeBag.push(registerMouseDownEvent(body));
    return () => {
      for (const callback of disposeBag) {
        callback();
      }
    };
  }, []);

  return <Routes />;
}
