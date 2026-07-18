const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * @typedef {Object} Photo
 * @property {number} albumId
 * @property {number} id
 * @property {string} title
 * @property {string} url
 * @property {string} thumbnailUrl
 */

/**
 * @typedef {Object} FetchPhotosParams
 * @property {number} page - Page number (1-based).
 * @property {number} limit - Items per page.
 * @property {AbortSignal} [signal] - AbortSignal to cancel the request.
 */

/**
 * Fetches a paginated list of photos from JSONPlaceholder.
 *
 * @param {FetchPhotosParams} params
 * @returns {Promise<Photo[]>}
 */
export const fetchPhotos = async ({ page, limit, signal }) => {
  const url = `${BASE_URL}/photos?_page=${page}&_limit=${limit}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch photos: ${response.status}`);
  }

  return response.json();
};