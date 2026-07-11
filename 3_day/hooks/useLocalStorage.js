import { useState, useEffect, useCallback } from 'react';

/**
 * @template T
 * @typedef {() => T} LazyInitializer
 */

/**
 * Custom hook for syncing state with localStorage.
 * Handles JSON serialization, errors, and cross-tab synchronization.
 *
 * @template T
 * @param {string} key - localStorage key.
 * @param {T | LazyInitializer<T>} initialValue - Initial value or function returning it.
 * @returns {[T, (value: T | ((prev: T) => T)) => void]} Tuple of [storedValue, setValue].
 *
 * @example
 * const [name, setName] = useLocalStorage('user-name', 'Guest');
 * const [count, setCount] = useLocalStorage('counter', () => computeExpensiveValue());
 */
const useLocalStorage = (key, initialValue) => {
  // Lazy initialization: if initialValue is a function, call it once.
  // This avoids expensive computations on every render.
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      // SSR safety: window is not available during server-side rendering.
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or return initialValue if key doesn't exist.
      return item ? JSON.parse(item) : (typeof initialValue === 'function' ? initialValue() : initialValue);
    } catch (error) {
      // If JSON.parse fails (corrupted data) or localStorage is unavailable,
      // log warning and fall back to initialValue.
      console.warn(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  // Wrapped in useCallback to maintain stable reference across renders.
  // This prevents unnecessary re-renders if setValue is passed as a prop.
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function (like useState), so we can update based on previous state.
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // Catch errors from JSON.stringify (circular references) or quota exceeded.
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Sync across tabs: when localStorage changes in another tab, update state.
  // This ensures consistency if user has the app open in multiple tabs.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        // Key was removed in another tab, reset to initialValue.
        setStoredValue(typeof initialValue === 'function' ? initialValue() : initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;