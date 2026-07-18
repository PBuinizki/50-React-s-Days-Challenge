const BASE_URL = 'https://dummyjson.com';

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string} thumbnail
 */

/**
 * @typedef {Object} FetchProductsParams
 * @property {number} page - Page number (1-based).
 * @property {number} limit - Items per page.
 * @property {AbortSignal} [signal] - AbortSignal to cancel the request.
 */

/**
 * Fetches a paginated list of products from DummyJSON.
 *
 * @param {FetchProductsParams} params
 * @returns {Promise<Product[]>}
 */
export const fetchProducts = async ({ page, limit, signal }) => {
  // DummyJSON использует skip/limit для пагинации
  const skip = (page - 1) * limit;
  const url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = await response.json();
  // Возвращаем только массив товаров, чтобы наш хук useInfiniteScroll 
  // мог сам определить hasMore по длине массива (data.products.length < limit)
  return data.products;
};