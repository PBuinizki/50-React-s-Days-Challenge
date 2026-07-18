import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * @template T
 * @typedef {Object} UseInfiniteScrollOptions
 * @property {(page: number, signal: AbortSignal) => Promise<T[]>} fetchFn - Async function to load a page.
 * @property {number} [pageSize=20] - Items per page.
 * @property {number} [rootMargin='200px'] - Trigger load before sentinel enters viewport.
 */

/**
 * @template T
 * @typedef {Object} UseInfiniteScrollResult
 * @property {T[]} items - Accumulated items from all loaded pages.
 * @property {boolean} isLoading - Whether a page is currently being fetched.
 * @property {boolean} isError - Whether the last fetch failed.
 * @property {boolean} hasMore - Whether more pages are available.
 * @property {(node: HTMLElement | null) => void} sentinelRef - Ref callback for the sentinel element.
 * @property {() => void} retry - Retry the last failed fetch.
 */

/**
 * Generic infinite scroll hook using IntersectionObserver.
 * Handles pagination, request cancellation on unmount, and error recovery.
 *
 * @template T
 * @param {UseInfiniteScrollOptions<T>} options
 * @returns {UseInfiniteScrollResult<T>}
 *
 * @example
 * const { items, isLoading, hasMore, sentinelRef } = useInfiniteScroll({
 *   fetchFn: (page, signal) => fetchPhotos({ page, limit: 20, signal }),
 * });
 */
const useInfiniteScroll = ({ fetchFn, pageSize = 20, rootMargin = '200px' }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // AbortController lives across renders to cancel in-flight requests on unmount.
  const abortControllerRef = useRef(null);
  // Guard against concurrent loads — Observer can fire multiple times.
  const isFetchingRef = useRef(false);
  // Stable ref to latest fetchFn to avoid re-creating observer on prop change.
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  // Load a single page. Wrapped in useCallback so it can be exposed as retry().
  const loadPage = useCallback(async (pageNum, { append = true } = {}) => {
    // Prevent concurrent loads.
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    // Cancel previous in-flight request to avoid race conditions.
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setIsError(false);

    try {
      const data = await fetchFnRef.current(pageNum, controller.signal);
      // If response was shorter than pageSize, we've reached the end.
      setHasMore(data.length >= pageSize);
      setItems((prev) => (append ? [...prev, ...data] : data));
      setPage(pageNum);
    } catch (error) {
      // Ignore intentional aborts (unmount or new request superseding old one).
      if (error.name !== 'AbortError') {
        console.error('Infinite scroll fetch error:', error);
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [pageSize]);

  // Initial load on mount.
  useEffect(() => {
    loadPage(1, { append: false });
    // Cleanup: abort any pending request on unmount to prevent state updates on unmounted component.
    return () => abortControllerRef.current?.abort();
  }, [loadPage]);

  // IntersectionObserver watches the sentinel element.
  // rootMargin='200px' triggers load before sentinel is visible — smoother UX.
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Only act when sentinel becomes visible.
        if (entries[0]?.isIntersecting) {
          loadPage(page + 1);
        }
      },
      { rootMargin }
    );

    const sentinel = sentinelNodeRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, isLoading, page, rootMargin, loadPage]);

  // Ref callback pattern: lets us observe the sentinel without re-running effect on every render.
  const sentinelNodeRef = useRef(null);
  const sentinelRef = useCallback((node) => {
    sentinelNodeRef.current = node;
  }, []);

  const retry = useCallback(() => {
    loadPage(page);
  }, [loadPage, page]);

  return { items, isLoading, isError, hasMore, sentinelRef, retry };
};

export default useInfiniteScroll;