import { useState, useEffect } from 'react';

/**
 * Responsive breakpoint hook.
 * @param {string} query - CSS media query string (e.g. '(min-width: 768px)')
 * @returns {boolean} Whether the media query matches
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
