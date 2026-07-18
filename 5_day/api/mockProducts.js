/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string} thumbnail
 */

/**
 * @typedef {Object} FetchMockParams
 * @property {number} page
 * @property {number} limit
 * @property {AbortSignal} [signal]
 */

/**
 * Имитирует запрос к API с задержкой и пагинацией.
 * Генерирует данные локально, что гарантирует работу без сетевых блокировок.
 *
 * @param {FetchMockParams} params
 * @returns {Promise<Product[]>}
 */
export const fetchMockProducts = async ({ page, limit, signal }) => {
  // 1. Имитируем сетевую задержку (500-1000 мс) для реалистичного UX
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

  // 2. Проверяем, не был ли запрос отменён (AbortController)
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  // 3. Ограничиваем общий объём данных (например, всего 48 товаров)
  // чтобы продемонстрировать состояние "конец списка" (hasMore = false)
  const totalItems = 48;
  const startIndex = (page - 1) * limit;

  if (startIndex >= totalItems) {
    return []; // Возвращаем пустой массив, если данные закончились
  }

  const endIndex = Math.min(startIndex + limit, totalItems);
  const newItems = [];

  for (let i = startIndex; i < endIndex; i++) {
    newItems.push({
      id: i + 1,
      title: `Умный гаджет Pro #${i + 1}`,
      description: `Это описание товара номер ${i + 1}.`,
      price: Math.floor(Math.random() * 15000) + 1500,
      // placehold.co — очень лёгкий и стабильный сервис, который редко блокируется
      thumbnail: `https://placehold.co/300x200/e2e8f0/475569?text=Item+${i + 1}`,
    });
  }

  return newItems;
};