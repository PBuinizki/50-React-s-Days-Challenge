import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { fetchMockProducts } from '../../api/mockProducts'; // <-- МЕНЯЕМ ЗДЕСЬ
import styles from './InfiniteList.module.css';

/**
 * @typedef {Object} InfiniteListProps
 * @property {string} [title] - Optional heading above the list.
 */

const InfiniteList = ({ title }) => {
  const { items, isLoading, isError, hasMore, sentinelRef, retry } = useInfiniteScroll({
    fetchFn: (page, signal) => fetchMockProducts({ page, limit: 12, signal }),
    pageSize: 12,
  });

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.grid}>
        {items.map((product) => (
          <article key={product.id} className={styles.card}>
            <img
              src={product.thumbnail}
              alt={product.title}
              className={styles.image}
              loading="lazy"
              width="300"
              height="200"
            />
            <div className={styles.content}>
              <h3 className={styles.productTitle}>{product.title}</h3>
              <p className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</p>
              <p className={styles.description}>{product.description}</p>
            </div>
          </article>
        ))}
      </div>

      {isLoading && items.length === 0 && (
        <div className={styles.grid} aria-busy="true" aria-label="Загрузка товаров">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {isLoading && items.length > 0 && (
        <div className={styles.loader} role="status">
          <span className={styles.spinner} />
          <span className="visually-hidden">Загрузка...</span>
        </div>
      )}

      {isError && (
        <div className={styles.error}>
          <p>Не удалось загрузить данные</p>
          <button type="button" className={styles.retryButton} onClick={retry}>
            Повторить
          </button>
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />}

      {!hasMore && items.length > 0 && (
        <p className={styles.endMessage}>Вы достигли конца списка (всего 48 товаров) ✨</p>
      )}
    </div>
  );
};

export default InfiniteList;