import { useState, useEffect } from 'react';
import Button from './components/Button';
import Modal from './components/Modal';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

/**
 * Root application component.
 * Demonstrates useLocalStorage hook with counter and theme preferences.
 * Applies theme class to document.body for global styling.
 *
 * @returns {JSX.Element}
 */
function App() {
  const [count, setCount] = useLocalStorage('demo-counter', 0);
  const [theme, setTheme] = useLocalStorage('demo-theme', 'light');
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (id) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  // Apply theme class to document.body whenever theme changes.
  // This ensures modal portals and other elements outside app-container
  // also receive theme styles.
  useEffect(() => {
    const themeClass = theme === 'dark' ? 'dark-theme' : 'light-theme';
    const oppositeClass = theme === 'dark' ? 'light-theme' : 'dark-theme';

    // Remove opposite theme class and add current one.
    // classList API is safer than className manipulation.
    document.body.classList.remove(oppositeClass);
    document.body.classList.add(themeClass);

    // Cleanup: remove theme class when component unmounts.
    // This prevents leaving orphaned classes if app is unmounted.
    return () => {
      document.body.classList.remove(themeClass);
    };
  }, [theme]);

  return (
    <div className="app-container">
      <header>
        <h1>🚀 50 Days of React</h1>
        <p>Day 3: Кастомный хук useLocalStorage</p>
      </header>

      <main className="demo-grid">
        <section className="variant-group">
          <h2 className="variant-title">Счётчик (сохраняется в localStorage)</h2>
          <div className="counter-display">
            <span className="counter-value">{count}</span>
          </div>
          <div className="button-row">
            <Button variant="secondary" onClick={() => setCount((prev) => prev - 1)}>
              −1
            </Button>
            <Button variant="primary" onClick={() => setCount(0)}>
              Сброс
            </Button>
            <Button variant="primary" onClick={() => setCount((prev) => prev + 1)}>
              +1
            </Button>
          </div>
          <p className="hint">
            Перезагрузи страницу — значение сохранится. Открой в другой вкладке — синхронизируется.
          </p>
        </section>

        <section className="variant-group">
          <h2 className="variant-title">Тема (применяется к body)</h2>
          <div className="button-row">
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              onClick={() => setTheme('light')}
            >
              Светлая
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => setTheme('dark')}
            >
              Тёмная
            </Button>
          </div>
          <p className="hint">
            Тема применяется ко всему документу, включая модальные окна.
          </p>
        </section>

        <section className="variant-group">
          <h2 className="variant-title">Модалка (Day 2)</h2>
          <Button variant="danger" onClick={() => openModal('clear')}>
            Очистить localStorage
          </Button>
        </section>
      </main>

      <Modal
        isOpen={activeModal === 'clear'}
        onClose={closeModal}
        title="Очистить localStorage?"
      >
        <p>Все сохранённые данные (счётчик, тема) будут удалены.</p>
        <div className="form-actions">
          <Button variant="secondary" onClick={closeModal}>
            Отмена
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Очистить
          </Button>
        </div>
      </Modal>

      <footer>
        <p>Сделано с ❤️ в рамках челленджа</p>
      </footer>
    </div>
  );
}

export default App;