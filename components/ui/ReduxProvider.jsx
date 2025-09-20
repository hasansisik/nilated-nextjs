'use client';

import { Provider } from 'react-redux';
import { useRef, useEffect } from 'react';
import { store } from '@/redux/store';

export function ReduxProvider({ children, preloadedState = {} }) {
  const storeRef = useRef();
  
  if (!storeRef.current) {
    // Create a new store instance if it doesn't exist yet
    storeRef.current = store;
  }
  
  // Use useEffect to hydrate the store after render
  useEffect(() => {
    // If there's preloaded state, update the store with it
    if (Object.keys(preloadedState).length > 0) {
      Object.keys(preloadedState).forEach(key => {
        if (preloadedState[key] && storeRef.current.getState()[key]) {
          storeRef.current.dispatch({
            type: `${key}/hydrate`,
            payload: preloadedState[key]
          });
        }
      });
    }
  }, [preloadedState]); // Only re-run if preloadedState changes

  return <Provider store={storeRef.current}>{children}</Provider>;
} 